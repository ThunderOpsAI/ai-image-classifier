export default function HistoryPage({ history }) {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6">
      <section className="rounded-xl border border-slate-800 bg-slate-900 p-5">
        <h2 className="mb-4 text-xl font-semibold text-cyan-300">Recent Classifications</h2>
        {!history.length ? (
          <p className="text-sm text-slate-400">No history yet. Upload an image to get started.</p>
        ) : (
          <ul className="space-y-4">
            {history.map((item) => (
              <li key={item.id} className="rounded-lg border border-slate-700 bg-slate-800/60 p-4">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-medium text-slate-200">{item.fileName || 'Uploaded image'}</p>
                  <p className="text-xs text-slate-400">{new Date(item.timestamp).toLocaleString()}</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-[160px_1fr]">
                  <img src={item.imageDataUrl} alt={item.fileName || 'Classification'} className="h-28 w-40 rounded-md object-cover" />
                  <ul className="space-y-2">
                    {item.predictions.slice(0, 5).map((prediction, index) => (
                      <li key={`${prediction.class}-${index}`} className="text-sm text-slate-300">
                        <span className="font-medium text-slate-100">{prediction.class}</span>
                        <span className="ml-2 text-cyan-300">{Math.round(prediction.confidence * 100)}%</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
