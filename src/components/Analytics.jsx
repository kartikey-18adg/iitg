import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale
} from 'chart.js'
import { Line, Doughnut, Bar, Radar } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale
)

const Analytics = ({ data }) => {
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#e2e8f0',
          font: { size: 14 }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: '#e2e8f0',
        bodyColor: '#e2e8f0',
        borderColor: '#6366f1',
        borderWidth: 1
      }
    },
    scales: {
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#94a3b8' }
      },
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#94a3b8' }
      }
    }
  }

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: '#e2e8f0' }
      }
    },
    scales: {
      r: {
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        ticks: { 
          color: '#94a3b8',
          backdropColor: 'transparent'
        },
        pointLabels: { color: '#e2e8f0' },
        beginAtZero: true
      }
    }
  }

  const processData = () => {
    if (!data || data.length === 0) return null

    const hourly = Array(24).fill(0)
    data.forEach(d => {
      const hour = d.timestamp.getHours()
      hourly[hour]++
    })

    const normal = data.filter(d => !d.isAnomaly).length
    const anomalies = data.filter(d => d.isAnomaly).length

    const locationCounts = {}
    data.forEach(d => {
      locationCounts[d.location] = (locationCounts[d.location] || 0) + 1
    })

    const dayData = Array(7).fill(0)
    data.forEach(d => {
      const day = d.timestamp.getDay()
      dayData[day]++
    })

    return {
      activityTimeline: {
        labels: Array.from({length: 24}, (_, i) => `${i}:00`),
        datasets: [{
          label: 'Activities',
          data: hourly,
          borderColor: '#6366f1',
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          tension: 0.4,
          fill: true,
          pointRadius: 5,
          pointHoverRadius: 8,
          pointBackgroundColor: '#6366f1',
          pointBorderColor: '#fff',
          pointBorderWidth: 2
        }]
      },
      anomalyDistribution: {
        labels: ['Normal Activities', 'Anomalies'],
        datasets: [{
          data: [normal, anomalies],
          backgroundColor: ['#10b981', '#ef4444'],
          borderWidth: 0,
          hoverOffset: 20
        }]
      },
      locationDistribution: {
        labels: Object.keys(locationCounts),
        datasets: [{
          label: 'Activities',
          data: Object.values(locationCounts),
          backgroundColor: 'rgba(240, 147, 251, 0.6)',
          borderColor: '#f093fb',
          borderWidth: 2,
          borderRadius: 8
        }]
      },
      weeklyTraffic: {
        labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        datasets: [{
          label: 'Weekly Traffic',
          data: dayData,
          borderColor: '#4facfe',
          backgroundColor: 'rgba(79, 172, 254, 0.2)',
          pointBackgroundColor: '#4facfe',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 8
        }]
      }
    }
  }

  const chartData = processData()

  if (!chartData) {
    return (
      <section id="analytics" className="px-4 py-20 sm:px-6 lg:px-8 bg-slate-800">
        <div className="mx-auto text-center max-w-7xl">
          <h2 className="mb-4 text-4xl font-bold gradient-text">Analytics & Insights</h2>
          <p className="text-xl text-slate-300">No data available for analysis</p>
        </div>
      </section>
    )
  }

  return (
    <section id="analytics" className="px-4 py-20 sm:px-6 lg:px-8 bg-slate-800">
      <div className="mx-auto max-w-7xl">
        {}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-4xl font-bold lg:text-5xl gradient-text">
            Analytics & Insights
          </h2>
          <p className="text-xl text-slate-300">
            Data-driven security intelligence
          </p>
        </motion.div>

        {}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            whileHover={{ y: -5 }}
            className="p-6 glass-card"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Activity Timeline</h3>
              <div className="flex space-x-2">
                <button className="px-3 py-1 text-sm text-white rounded-lg bg-primary-500">24H</button>
                <button className="px-3 py-1 text-sm rounded-lg bg-white/10 text-slate-300 hover:bg-white/20">7D</button>
                <button className="px-3 py-1 text-sm rounded-lg bg-white/10 text-slate-300 hover:bg-white/20">30D</button>
              </div>
            </div>
            <div className="h-64">
              <Line data={chartData.activityTimeline} options={chartOptions} />
            </div>
          </motion.div>

          {}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ y: -5 }}
            className="p-6 glass-card"
          >
            <h3 className="mb-6 text-xl font-bold">Anomaly Distribution</h3>
            <div className="flex items-center justify-center h-64">
              <Doughnut 
                data={chartData.anomalyDistribution} 
                options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    legend: {
                      position: 'bottom',
                      labels: { 
                        color: '#e2e8f0',
                        padding: 20,
                        font: { size: 14 }
                      }
                    }
                  }
                }} 
              />
            </div>
          </motion.div>

          {}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            whileHover={{ y: -5 }}
            className="p-6 glass-card"
          >
            <h3 className="mb-6 text-xl font-bold">Location Heatmap</h3>
            <div className="h-64">
              <Bar 
                data={chartData.locationDistribution} 
                options={{
                  ...chartOptions,
                  scales: {
                    ...chartOptions.scales,
                    x: {
                      ...chartOptions.scales.x,
                      grid: { display: false },
                      ticks: { 
                        color: '#94a3b8',
                        maxRotation: 45,
                        minRotation: 45
                      }
                    },
                    y: {
                      ...chartOptions.scales.y,
                      beginAtZero: true
                    }
                  }
                }} 
              />
            </div>
          </motion.div>

          {}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            whileHover={{ y: -5 }}
            className="p-6 glass-card"
          >
            <h3 className="mb-6 text-xl font-bold">Weekly Traffic</h3>
            <div className="h-64">
              <Radar 
                data={chartData.weeklyTraffic} 
                options={radarOptions} 
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Analytics
