export default function CCTVSection() {
  return (
    <section id="cctv" className="py-20 px-4 bg-slate-900 text-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gradient bg-gradient-to-r from-fuchsia-300 via-purple-400 to-indigo-400 text-transparent bg-clip-text mb-3">
          CCTV & Face Detection
        </h2>
        <p className="text-gray-400 mb-6">Upload footage or images for AI-powered identification</p>
        <div className="md:flex gap-8">
          <div className="flex-1 bg-white/5 p-8 rounded-2xl text-center">
            <div className="text-6xl mb-2 animate-bounce">📹</div>
            <div className="mb-2 font-semibold">Drop CCTV Footage Here</div>
            <p className="mb-4 text-gray-500">Supported: MP4, AVI, MOV, JPG, PNG</p>
            <button className="btn btn-gradient px-6 py-2 rounded-xl font-bold mt-4">Choose File</button>
          </div>
          <div className="flex-1 bg-white/5 p-8 rounded-2xl mt-8 md:mt-0">
            <h3 className="font-bold mb-3">🎯 AI Detection Features</h3>
            <ul className="space-y-2 text-gray-300 text-left">
              <li><span className="text-green-400 font-bold">✓</span> Face Recognition</li>
              <li><span className="text-green-400 font-bold">✓</span> Person Tracking</li>
              <li><span className="text-green-400 font-bold">✓</span> Behavior Analysis</li>
              <li><span className="text-green-400 font-bold">✓</span> Real-time Alerts</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
