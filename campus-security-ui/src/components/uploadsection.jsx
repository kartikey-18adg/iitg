export default function UploadSection() {
  return (
    <section id="upload" className="py-20 px-4 bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-950 text-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gradient bg-gradient-to-r from-indigo-300 via-pink-400 to-fuchsia-400 text-transparent bg-clip-text mb-3">
          Data Upload & Processing
        </h2>
        <p className="text-gray-400 mb-6">Upload campus data for comprehensive analysis</p>
        <div className="md:flex gap-10 mb-10">
          <div className="flex-1 bg-white/5 p-8 rounded-2xl text-center">
            <div className="text-6xl mb-2 animate-pulse">📤</div>
            <div className="mb-2 font-semibold">Drop Excel Files Here</div>
            <p className="mb-4 text-gray-500">or click to browse your files</p>
            <button className="btn btn-gradient px-6 py-2 rounded-xl font-bold mt-4">Select File</button>
            <div className="mt-4 text-sm text-indigo-300">Supported: .xlsx, .xls, .csv (Max 16MB)</div>
          </div>
          <div className="flex-1 bg-white/5 p-8 rounded-2xl mt-8 md:mt-0">
            <h3 className="font-bold mb-3">📋 Supported Formats</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 bg-black/10 p-3 rounded-lg">
                <span className="text-xl">📊</span> Excel (.xlsx, .xls)
              </div>
              <div className="flex items-center gap-3 bg-black/10 p-3 rounded-lg">
                <span className="text-xl">📄</span> CSV (.csv)
              </div>
              <div className="flex items-center gap-3 bg-black/10 p-3 rounded-lg">
                <span className="text-xl">📦</span> Max 16MB
              </div>
            </div>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <button className="py-4 bg-indigo-700 rounded-xl hover:bg-gradient-to-r hover:from-pink-500 hover:to-indigo-400 text-white font-bold transition">
            🔍 Analyze Data
          </button>
          <button className="py-4 bg-fuchsia-700 rounded-xl hover:bg-gradient-to-r hover:from-indigo-500 hover:to-pink-400 text-white font-bold transition">
            📊 Use Sample Data
          </button>
          <button className="py-4 bg-cyan-700 rounded-xl hover:bg-gradient-to-r hover:from-indigo-500 hover:to-cyan-400 text-white font-bold transition">
            💾 Export Results
          </button>
        </div>
      </div>
    </section>
  );
}
