import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, Eye, AlertTriangle, CheckCircle, Clock } from 'lucide-react'

const DataTable = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')

  const filteredData = useMemo(() => {
    let filtered = data

    // Apply filter
    if (filterType === 'normal') {
      filtered = filtered.filter(d => !d.isAnomaly)
    } else if (filterType === 'anomaly') {
      filtered = filtered.filter(d => d.isAnomaly)
    }

    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(d => 
        d.entityId.toLowerCase().includes(term) ||
        d.location.toLowerCase().includes(term) ||
        d.activity.toLowerCase().includes(term)
      )
    }

    return filtered.slice(0, 20)
  }, [data, searchTerm, filterType])

  const formatTimestamp = (date) => {
    return date.toLocaleString()
  }

  const getStatusBadge = (isAnomaly) => {
    if (isAnomaly) {
      return (
        <span className="inline-flex items-center space-x-2 px-3 py-1 bg-red-500/10 text-red-400 rounded-full text-sm font-medium">
          <AlertTriangle className="w-4 h-4" />
          <span>Anomaly</span>
        </span>
      )
    } else {
      return (
        <span className="inline-flex items-center space-x-2 px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-sm font-medium">
          <CheckCircle className="w-4 h-4" />
          <span>Normal</span>
        </span>
      )
    }
  }

  const viewDetails = (record) => {
    alert(`
📋 Activity Details

ID: ${record.id}
Entity: ${record.entityId}
Location: ${record.location}
Activity: ${record.activity}
Timestamp: ${record.timestamp.toLocaleString()}
Duration: ${record.duration} minutes
Score: ${record.score.toFixed(3)}
Status: ${record.isAnomaly ? 'ANOMALY' : 'NORMAL'}
    `)
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl lg:text-5xl font-bold gradient-text mb-4">
            Recent Activities
          </h2>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 mb-8"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="🔍 Search activities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
            />
          </div>
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
          >
            <option value="all">All Activities</option>
            <option value="normal">Normal Only</option>
            <option value="anomaly">Anomalies Only</option>
          </select>
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="glass-card overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-primary-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-primary-400 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-primary-400 uppercase tracking-wider">
                    Entity ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-primary-400 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-primary-400 uppercase tracking-wider">
                    Activity
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-primary-400 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-primary-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-slate-400">
                      <div className="flex flex-col items-center space-y-4">
                        <Search className="w-12 h-12 text-slate-600" />
                        <div className="text-lg font-medium">No results found</div>
                        <div className="text-sm">Try adjusting your search or filter criteria</div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredData.map((row, index) => (
                    <motion.tr
                      key={row.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                      whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
                      className="transition-colors duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(row.isAnomaly)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-300">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-slate-400" />
                          <span>{formatTimestamp(row.timestamp)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-semibold text-white">{row.entityId}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-300">
                        {row.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-300">
                        {row.activity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`font-semibold ${
                          row.isAnomaly ? 'text-red-400' : 'text-green-400'
                        }`}>
                          {row.score.toFixed(3)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => viewDetails(row)}
                          className="inline-flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-sm font-medium"
                        >
                          <Eye className="w-4 h-4" />
                          <span>View</span>
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default DataTable
