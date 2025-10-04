// App.jsx
import React from "react";

// --- NAVBAR ---
function Navbar() {
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

// --- HERO SECTION ---
function Hero() {
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

// --- STAT CARD ---
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

// --- DASHBOARD SECTION ---
function Dashboard() {
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

// --- ANALYTICS SECTION ---
function Analytics() {
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

// --- CCTV SECTION ---
function CCTVSection() {
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

// --- UPLOAD SECTION ---
function UploadSection() {
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

// --- DATA TABLE SECTION ---
function ActivityTable() {
  return (
    <section className="py-20 px-4 bg-slate-950 text-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gradient bg-gradient-to-r from-indigo-300 via-pink-400 to-fuchsia-400 text-transparent bg-clip-text mb-6">
          Recent Activities
        </h2>
        <div className="flex gap-3 mb-4">
          <input type="text" className="w-full bg-white/5 border border-white/10 p-2 rounded-lg text-white focus:outline-none focus:border-indigo-400" placeholder="🔍 Search activities..." />
          <select className="bg-white/5 border border-white/10 p-2 rounded-lg text-white focus:outline-none focus:border-indigo-400">
            <option value="all">All Activities</option>
            <option value="normal">Normal Only</option>
            <option value="anomaly">Anomalies Only</option>
          </select>
        </div>
        <div className="overflow-x-auto bg-white/5 rounded-xl border border-white/10">
          <table className="min-w-full">
            <thead>
              <tr className="bg-indigo-400/10">
                <th className="p-4 text-left text-xs uppercase tracking-wider">Status</th>
                <th className="p-4 text-left text-xs uppercase tracking-wider">Timestamp</th>
                <th className="p-4 text-left text-xs uppercase tracking-wider">Entity ID</th>
                <th className="p-4 text-left text-xs uppercase tracking-wider">Location</th>
                <th className="p-4 text-left text-xs uppercase tracking-wider">Activity</th>
                <th className="p-4 text-left text-xs uppercase tracking-wider">Score</th>
                <th className="p-4 text-left text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-indigo-400/5">
                <td className="p-3"><span className="px-2 py-1 rounded-full bg-green-400/15 text-green-400 font-bold text-xs">Normal</span></td>
                <td className="p-3">2025-10-04 09:03</td>
                <td className="p-3">E0212</td>
                <td className="p-3">Gate A</td>
                <td className="p-3">Entry</td>
                <td className="p-3">98%</td>
                <td className="p-3"><button className="text-indigo-400 hover:underline">View</button></td>
              </tr>
              <tr className="hover:bg-pink-400/10">
                <td className="p-3"><span className="px-2 py-1 rounded-full bg-red-400/15 text-red-400 font-bold text-xs">Anomaly</span></td>
                <td className="p-3">2025-10-04 08:58</td>
                <td className="p-3">U1387</td>
                <td className="p-3">Block B</td>
                <td className="p-3">Unrecognized face</td>
                <td className="p-3">72%</td>
                <td className="p-3"><button className="text-indigo-400 hover:underline">View</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

// --- FOOTER ---
function Footer() {
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

// --- APP COMPOSITE ---
export default function App() {
  return (
    <div className="bg-slate-950 min-h-screen font-sans">
      <Navbar />
      <Hero />
      <Dashboard />
      <Analytics />
      <CCTVSection />
      <UploadSection />
      <ActivityTable />
      <Footer />
    </div>
  );
}
