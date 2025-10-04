export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-white/10 py-10 mt-12">
      <div className="max-w-6xl mx-auto grid md:grid-cols-4 grid-cols-1 gap-8 mb-6 px-6">
        <div>
          <div className="font-extrabold text-lg text-gradient bg-gradient-to-r from-indigo-300 via-pink-400 to-fuchsia-400 text-transparent bg-clip-text mb-1">
            Campus Security
          </div>
          <p className="text-gray-400 text-sm">AI-powered security monitoring for educational institutions</p>
          <div className="flex mt-4 gap-2">
            <a href="#" className="bg-white/10 w-8 h-8 flex items-center justify-center rounded-lg text-xl hover:bg-indigo-400 transition">📘</a>
            <a href="#" className="bg-white/10 w-8 h-8 flex items-center justify-center rounded-lg text-xl hover:bg-pink-400 transition">🐦</a>
            <a href="#" className="bg-white/10 w-8 h-8 flex items-center justify-center rounded-lg text-xl hover:bg-blue-400 transition">💼</a>
          </div>
        </div>
        <div>
          <h4 className="font-bold mb-2">Quick Links</h4>
          <ul className="space-y-1 text-sm">
            <li><a href="#home" className="hover:text-indigo-400">Home</a></li>
            <li><a href="#dashboard" className="hover:text-indigo-400">Dashboard</a></li>
            <li><a href="#analytics" className="hover:text-indigo-400">Analytics</a></li>
            <li><a href="#cctv" className="hover:text-indigo-400">CCTV</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-2">Resources</h4>
          <ul className="space-y-1 text-sm">
            <li><a href="#" className="hover:text-indigo-400">Documentation</a></li>
            <li><a href="#" className="hover:text-indigo-400">API Reference</a></li>
            <li><a href="#" className="hover:text-indigo-400">Support</a></li>
            <li><a href="#" className="hover:text-indigo-400">Privacy Policy</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-2">Contact</h4>
          <p className="text-gray-200 text-sm">📧 security@iitg.ac.in</p>
          <p className="text-gray-200 text-sm">📞 +91 (361) XXX-XXXX</p>
          <p className="text-gray-200 text-sm">📍 IIT Guwahati, Assam</p>
        </div>
      </div>
      <div className="text-center text-gray-400 text-xs border-t border-white/10 pt-4">
        &copy; 2025 IIT Guwahati. All rights reserved.
      </div>
    </footer>
  );
}
