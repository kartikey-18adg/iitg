export default function Analytics() {
  return (
    <section id="analytics" className="py-20 px-4 bg-gradient-to-br from-indigo-900 to-slate-950 text-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gradient bg-gradient-to-r from-indigo-300 via-pink-400 to-fuchsia-400 text-transparent bg-clip-text mb-3">
          Analytics & Insights
        </h2>
        <p className="text-gray-400 mb-6">Data-driven security intelligence</p>
        <div className="grid md:grid-cols-2 grid-cols-1 gap-8">
          <div className="bg-white/5 rounded-lg p-6">[Insert Activity Timeline Chart Here]</div>
          <div className="bg-white/5 rounded-lg p-6">[Insert Anomaly Distribution Chart Here]</div>
          <div className="bg-white/5 rounded-lg p-6">[Insert Location Heatmap Here]</div>
          <div className="bg-white/5 rounded-lg p-6">[Insert Hourly Traffic Chart Here]</div>
        </div>
      </div>
    </section>
  );
}
