export default function Navbar() {
  return (
    <nav className="sticky top-0 w-full z-40 bg-slate-950/90 backdrop-blur border-b border-white/5">
      <div className="mx-auto max-w-7xl px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl animate-bounce">🛡️</span>
          <div>
            <span className="block font-bold text-xl text-gradient bg-gradient-to-br from-indigo-400 via-fuchsia-400 to-pink-400 text-transparent bg-clip-text">
              Campus Security
            </span>
            <span className="block text-xs text-gray-400">
              IITG Monitoring System
            </span>
          </div>
        </div>
        <nav>
          <ul className="flex gap-6 font-semibold text-lg">
            <li><a href="#home" className="hover:text-indigo-400 transition">Home</a></li>
            <li><a href="#dashboard" className="hover:text-indigo-400 transition">Dashboard</a></li>
            <li><a href="#analytics" className="hover:text-indigo-400 transition">Analytics</a></li>
            <li><a href="#cctv" className="hover:text-indigo-400 transition">CCTV</a></li>
            <li><a href="#upload" className="hover:text-indigo-400 transition">Upload</a></li>
          </ul>
        </nav>
      </div>
    </nav>
  );
}
