import { useCallback, useMemo, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { v4 as uuidv4 } from 'uuid';
import PredictionList from '../components/PredictionList';
import { appendHistoryItem } from '../lib/storage';

function toDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function classifyImage(model, imageUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = async () => {
      try {
        const results = await model.classify(img, 5);
        resolve(results);
      } catch (error) {
        reject(error);
      }
    };
    img.onerror = reject;
    img.src = imageUrl;
  });
}

export default function ClassifyPage({ model, modelStatus, onHistoryUpdate }) {
  const [imageDataUrl, setImageDataUrl] = useState(null);
  const [fileName, setFileName] = useState('');
  const [predictions, setPredictions] = useState([]);
  const [isClassifying, setIsClassifying] = useState(false);
  const [error, setError] = useState('');

  const classify = useCallback(
    async (file) => {
      if (!model) return;
      setError('');
      setIsClassifying(true);
      try {
        const dataUrl = await toDataUrl(file);
        setImageDataUrl(dataUrl);
        setFileName(file.name);
        const results = await classifyImage(model, dataUrl);
        setPredictions(results);

        const historyItem = {
          id: uuidv4(),
          timestamp: new Date().toISOString(),
          predictions: results.map((result) => ({
            class: result.className,
            confidence: Number(result.probability.toFixed(4)),
          })),
          imageDataUrl: dataUrl,
          fileName: file.name,
        };

        const updated = appendHistoryItem(historyItem);
        onHistoryUpdate(updated);
      } catch (classifyError) {
        setError('Classification failed. Please try another image.');
      } finally {
        setIsClassifying(false);
      }
    },
    [model, onHistoryUpdate],
  );

  const onDrop = useCallback(
    async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (!file) return;
      await classify(file);
    },
    [classify],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
    },
    maxFiles: 1,
    disabled: modelStatus !== 'ready' || isClassifying,
  });

  const downloadResult = useMemo(
    () => () => {
      if (!predictions.length) return;

      const payload = {
        fileName,
        timestamp: new Date().toISOString(),
        predictions: predictions.map((result) => ({
          class: result.className,
          confidence: Number(result.probability.toFixed(4)),
        })),
      };

      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `${(fileName || 'classification').replace(/\.[^/.]+$/, '')}-results.json`;
      anchor.click();
      URL.revokeObjectURL(url);
    },
    [fileName, predictions],
  );

  return (
    <main className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-6 sm:grid-cols-2 sm:px-6">
      <section className="space-y-4 rounded-xl border border-slate-800 bg-slate-900 p-5">
        <h2 className="text-xl font-semibold text-cyan-300">Upload an image</h2>
        <div
          {...getRootProps()}
          className={`cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
            isDragActive ? 'border-cyan-400 bg-cyan-500/10' : 'border-slate-700 hover:border-cyan-500'
          } ${modelStatus !== 'ready' ? 'cursor-not-allowed opacity-60' : ''}`}
        >
          <input {...getInputProps()} />
          {modelStatus !== 'ready' ? (
            <p className="text-sm text-slate-300">{modelStatus === 'loading' ? 'Loading model...' : 'Model unavailable'}</p>
          ) : (
            <p className="text-sm text-slate-300">
              {isDragActive ? 'Drop your image here' : 'Drag and drop JPG/PNG/WebP, or click to select'}
            </p>
          )}
        </div>
        {error && <p className="text-sm text-red-300">{error}</p>}
        {isClassifying && <p className="text-sm text-slate-300">Running inference...</p>}
      </section>

      <section className="space-y-4 rounded-xl border border-slate-800 bg-slate-900 p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-cyan-300">Predictions</h2>
          <button
            type="button"
            onClick={downloadResult}
            disabled={!predictions.length}
            className="rounded-md bg-cyan-500 px-3 py-2 text-xs font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Download JSON
          </button>
        </div>
        {imageDataUrl && (
          <figure className="overflow-hidden rounded-lg border border-slate-700">
            <img src={imageDataUrl} alt="Uploaded preview" className="max-h-72 w-full object-contain" />
          </figure>
        )}
        <PredictionList predictions={predictions} />
      </section>
    </main>
  );
}
