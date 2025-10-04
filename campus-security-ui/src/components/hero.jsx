export default function Hero() {
  return (
    <section id="home" className="relative py-24 bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-900 text-white flex flex-col items-center justify-center min-h-[80vh]">
      <div className="text-center max-w-3xl mx-auto">
        <span className="inline-block bg-indigo-500/30 px-4 py-1 rounded-full mb-3 text-sm font-medium">AI-Powered Security</span>
        <h1 className="text-5xl md:text-7xl font-black leading-tight mb-4">
          Campus Security <span className="text-gradient bg-gradient-to-r from-indigo-300 via-pink-400 to-fuchsia-400 text-transparent bg-clip-text">Monitoring System</span>
        </h1>
        <p className="text-lg text-gray-300 mb-6">
          Real-time entity resolution, activity tracking, and anomaly detection powered by advanced machine learning algorithms.
        </p>
        <div className="flex gap-4 justify-center mb-8">
          <a href="#upload" className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-pink-600 rounded-xl font-bold shadow-lg transition hover:scale-105 flex items-center gap-2">
            🚀 Get Started
          </a>
          <a href="#dashboard" className="px-6 py-3 bg-white text-indigo-800 font-bold rounded-xl shadow-lg transition hover:bg-gray-100 hover:text-indigo-600 flex items-center gap-2">
            📊 View Dashboard
          </a>
        </div>
        <div className="flex justify-center gap-12 mt-8">
          <div>
            <div className="text-3xl font-extrabold">99.9%</div>
            <div className="text-gray-400 text-sm">Accuracy</div>
          </div>
          <div>
            <div className="text-3xl font-extrabold">24/7</div>
            <div className="text-gray-400 text-sm">Monitoring</div>
          </div>
          <div>
            <div className="text-3xl font-extrabold">Real-time</div>
            <div className="text-gray-400 text-sm">Alerts</div>
          </div>
        </div>
      </div>
    </section>
  );
}
