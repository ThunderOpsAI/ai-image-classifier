export default function AboutPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6">
      <section className="space-y-4 rounded-xl border border-slate-800 bg-slate-900 p-5">
        <h2 className="text-xl font-semibold text-cyan-300">Model Information</h2>
        <p className="text-sm text-slate-300">
          This app uses TensorFlow.js with the pre-trained MobileNet v2 model (trained on ImageNet) for
          client-side image classification.
        </p>
        <ul className="list-inside list-disc space-y-1 text-sm text-slate-300">
          <li>Inference runs entirely in your browser, with no backend API.</li>
          <li>Input images are automatically resized internally for 224x224 processing.</li>
          <li>Top 5 predictions and confidence scores are displayed after upload.</li>
          <li>Recent results are saved to LocalStorage for quick history access.</li>
        </ul>
      </section>
    </main>
  );
}
