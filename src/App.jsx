import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import * as mobilenet from '@tensorflow-models/mobilenet';
import '@tensorflow/tfjs';
import NavBar from './components/NavBar';
import ClassifyPage from './pages/ClassifyPage';
import HistoryPage from './pages/HistoryPage';
import AboutPage from './pages/AboutPage';
import { getHistory } from './lib/storage';

export default function App() {
  const [model, setModel] = useState(null);
  const [modelStatus, setModelStatus] = useState('loading');
  const [history, setHistory] = useState([]);

  useEffect(() => {
    setHistory(getHistory());

    async function loadModel() {
      try {
        const loadedModel = await mobilenet.load({ version: 2, alpha: 1.0 });
        setModel(loadedModel);
        setModelStatus('ready');
      } catch {
        setModelStatus('error');
      }
    }

    loadModel();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <NavBar />
      <Routes>
        <Route
          path="/"
          element={<ClassifyPage model={model} modelStatus={modelStatus} onHistoryUpdate={setHistory} />}
        />
        <Route path="/history" element={<HistoryPage history={history} />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </div>
  );
}
