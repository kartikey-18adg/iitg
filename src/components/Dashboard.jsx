import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FileText, Users, AlertTriangle, Bell, RefreshCw, Activity } from 'lucide-react'

const Dashboard = ({ data }) => {
  const [stats, setStats] = useState({
    totalRecords: 0,
    entitiesCount: 0,
    anomaliesCount: 0,
    alertsCount: 0
  })

  const [activities, setActivities] = useState([])

  useEffect(() => {
    if (data.length > 0) {
      const anomalies = data.filter(d => d.isAnomaly)
      const criticalAlerts = anomalies.filter(a => a.score < -1.0)
      const entities = new Set(data.map(d => d.entityId))

      setStats({
        totalRecords: data.length,
        entitiesCount: entities.size,
        anomaliesCount: anomalies.length,
        alertsCount: criticalAlerts.length
      })

      setActivities(data.slice(0, 10))
    }
  }, [data])

  const statCards = [
    {
      icon: FileText,
      title: 'Total Records',
      value: stats.totalRecords,
      trend: '+12.5%',
      trendType: 'positive',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Users,
      title: 'Entities Identified',
      value: stats.entitiesCount,
      trend: '+8.3%',
      trendType: 'positive',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: AlertTriangle,
      title: 'Anomalies Detected',
      value: stats.anomaliesCount,
      trend: '+3.2%',
      trendType: 'negative',
      color: 'from-red-500 to-red-600'
    },
    {
      icon: Bell,
      title: 'Active Alerts',
      value: stats.alertsCount,
      trend: '+2.1%',
      trendType: 'negative',
      color: 'from-orange-500 to-orange-600'
    }
  ]

  const formatTimestamp = (date) => {
    const now = new Date()
    const diff = Math.floor((now - date) / 1000)
    
    if (diff < 60) return `${diff}s ago`
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    return `${Math.floor(diff / 86400)}d ago`
  }

  const refreshActivities = () => {
    setActivities(data.slice(0, 10))
  }

  return (
    <section id="dashboard" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold gradient-text mb-4">
            System Dashboard
          </h2>
          <p className="text-xl text-slate-300">
            Real-time monitoring and statistics
          </p>
        </motion.div>

        {}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {statCards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="stat-card group"
            >
              <div className="flex items-center space-x-4">
                <div className={`w-16 h-16 bg-gradient-to-r ${card.color} rounded-2xl flex items-center justify-center group-hover:animate-bounce`}>
                  <card.icon className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-3xl font-bold gradient-text mb-1">
                    {card.value.toLocaleString()}
                  </div>
                  <div className="text-slate-400 mb-2">{card.title}</div>
                  <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-sm font-medium ${
                    card.trendType === 'positive' 
                      ? 'bg-green-500/10 text-green-400' 
                      : 'bg-red-500/10 text-red-400'
                  }`}>
                    <span>{card.trendType === 'positive' ? '↗' : '↗'}</span>
                    <span>{card.trend}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="glass-card p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <h3 className="text-2xl font-bold">Live Activity Feed</h3>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={refreshActivities}
              className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </motion.button>
          </div>

          <div className="space-y-4 max-h-96 overflow-y-auto">
            {activities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-center space-x-4 p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-colors group"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  activity.isAnomaly 
                    ? 'bg-gradient-to-r from-red-500 to-red-600' 
                    : 'bg-gradient-to-r from-green-500 to-green-600'
                }`}>
                  {activity.isAnomaly ? (
                    <AlertTriangle className="w-6 h-6 text-white" />
                  ) : (
                    <Activity className="w-6 h-6 text-white" />
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="font-semibold text-white mb-1">
                    {activity.entityId} - {activity.activity}
                  </div>
                  <div className="text-sm text-slate-400">
                    {activity.location} • {formatTimestamp(activity.timestamp)}
                  </div>
                </div>
                
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  activity.isAnomaly 
                    ? 'bg-red-500/10 text-red-400' 
                    : 'bg-green-500/10 text-green-400'
                }`}>
                  {activity.score.toFixed(3)}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Dashboard
