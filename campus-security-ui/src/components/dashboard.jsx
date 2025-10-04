function StatCard({ icon, value, label, trend, trendType }) {
  const trendColor = trendType === "up" ? "text-green-400 bg-green-400/10" : "text-red-400 bg-red-400/10";
  return (
    <div className="rounded-2xl bg-white/5 p-7 flex flex-col items-center shadow-xl overflow-hidden hover:scale-105 transition relative">
      <span className="text-4xl mb-2">{icon}</span>
      <div className="text-3xl font-bold bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-pink-400 text-transparent bg-clip-text">{value}</div>
      <span className="mt-1 text-gray-400 text-xs">{label}</span>
      <span className={`mt-3 px-3 py-1 rounded-full text-xs font-semibold ${trendColor}`}>{trendType === "up" ? "↑" : "↓"} {trend}</span>
      <span className="absolute inset-0 pointer-events-none opacity-0 hover:opacity-10 bg-gradient-to-r from-indigo-200 via-indigo-100 to-pink-100 transition"></span>
    </div>
  );
}

export default function Dashboard() {
  return (
    <section id="dashboard" className="py-20 px-4 bg-slate-950 text-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gradient bg-gradient-to-r from-indigo-400 via-pink-400 to-fuchsia-400 text-transparent bg-clip-text mb-3">
          System Dashboard
        </h2>
        <p className="text-gray-400 mb-10">Real-time monitoring and statistics</p>
        <div className="grid md:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-6 mb-10">
          <StatCard icon="📁" value="1247" label="Total Records" trend="12.5%" trendType="up"/>
          <StatCard icon="👥" value="342" label="Entities Identified" trend="8.3%" trendType="up"/>
          <StatCard icon="⚠️" value="23" label="Anomalies Detected" trend="3.2%" trendType="up"/>
          <StatCard icon="🔔" value="5" label="Active Alerts" trend="2.1%" trendType="up"/>
        </div>
        <div className="bg-white/5 rounded-xl p-6 mb-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <span className="inline-block w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
              Live Activity Feed
            </h3>
            <button className="px-3 py-1 bg-indigo-600 rounded-md text-white hover:bg-indigo-500 transition">🔄 Refresh</button>
          </div>
          <div className="max-h-52 overflow-y-auto">
            <div className="p-3 bg-white/10 mb-2 rounded-lg">Door opened at Main Gate by John Doe <span className="ml-2 px-2 rounded-full bg-green-400/20 text-green-400 text-xs font-bold">Normal</span></div>
            <div className="p-3 bg-white/10 mb-2 rounded-lg">Unrecognized face detected in Block B <span className="ml-2 px-2 rounded-full bg-red-400/20 text-red-400 text-xs font-bold">Anomaly</span></div>
            <div className="p-3 bg-white/10 mb-2 rounded-lg">Motion detected in Parking Lot <span className="ml-2 px-2 rounded-full bg-yellow-400/20 text-yellow-400 text-xs font-bold">Alert</span></div>
          </div>
        </div>
      </div>
    </section>
  );
}
