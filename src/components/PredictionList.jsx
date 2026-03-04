export default function PredictionList({ predictions }) {
  if (!predictions?.length) {
    return <p className="text-sm text-slate-400">No predictions yet.</p>;
  }

  return (
    <ul className="space-y-3">
      {predictions.map((prediction, index) => {
        const confidence = Math.round(prediction.probability * 100);
        return (
          <li key={`${prediction.className}-${index}`} className="rounded-lg bg-slate-800 p-3">
            <div className="mb-1 flex items-center justify-between">
              <p className="text-sm font-medium text-slate-100">{prediction.className}</p>
              <p className="text-sm font-semibold text-cyan-300">{confidence}%</p>
            </div>
            <div className="h-2 rounded-full bg-slate-700">
              <div className="h-2 rounded-full bg-cyan-400" style={{ width: `${confidence}%` }} />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
