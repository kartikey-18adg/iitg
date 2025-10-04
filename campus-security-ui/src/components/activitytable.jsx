export default function ActivityTable() {
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
