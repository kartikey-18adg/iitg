import React from 'react'
import { motion } from 'framer-motion'
import { Rocket, BarChart3, Shield, Target, TrendingUp, Zap } from 'lucide-react'

const Hero = ({ onScrollToSection }) => {
  const floatingCards = [
    {
      icon: Target,
      title: 'Entity Resolution',
      description: 'AI-powered identity matching',
      delay: 0
    },
    {
      icon: TrendingUp,
      title: 'Real-time Analytics',
      description: 'Live data visualization',
      delay: 0.2
    },
    {
      icon: Zap,
      title: 'Instant Alerts',
      description: 'Anomaly detection system',
      delay: 0.4
    }
  ]

  const stats = [
    { value: '99.9%', label: 'Accuracy' },
    { value: '24/7', label: 'Monitoring' },
    { value: 'Real-time', label: 'Alerts' }
  ]

  return (
    <section className="flex items-center justify-center min-h-screen px-4 pt-16 sm:px-6 lg:px-8">
      <div className="w-full mx-auto max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center px-4 py-2 space-x-2 border rounded-full bg-white/10 backdrop-blur-md border-white/20"
            >
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">AI-Powered Security</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-4"
            >
              <h1 className="text-5xl font-bold leading-tight lg:text-7xl">
                <span className="block text-white">Campus Security</span>
                <span className="block gradient-text">Monitoring System</span>
              </h1>
              <p className="max-w-2xl text-xl leading-relaxed text-slate-300">
                Real-time entity resolution, activity tracking, and anomaly detection 
                powered by advanced machine learning algorithms
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-col gap-4 sm:flex-row"
            >
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onScrollToSection('upload')}
                className="flex items-center space-x-2 btn-primary group"
              >
                <Rocket className="w-5 h-5 group-hover:animate-bounce" />
                <span>Get Started</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onScrollToSection('dashboard')}
                className="flex items-center space-x-2 btn-secondary"
              >
                <BarChart3 className="w-5 h-5" />
                <span>View Dashboard</span>
              </motion.button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex flex-wrap gap-8 pt-8"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl font-bold gradient-text">{stat.value}</div>
                  <div className="text-sm text-slate-400">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative hidden lg:block"
          >
            <div className="relative h-96">
              {floatingCards.map((card, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50, scale: 0.8 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0, 
                    scale: 1,
                    y: [0, -20, 0]
                  }}
                  transition={{ 
                    duration: 0.6, 
                    delay: 1 + index * 0.2,
                    y: {
                      duration: 6,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }
                  }}
                  whileHover={{ 
                    scale: 1.05, 
                    y: -10,
                    transition: { duration: 0.3 }
                  }}
                  className="absolute p-6 cursor-pointer glass-card w-72 group"
                  style={{
                    top: `${20 + index * 30}%`,
                    right: `${10 + index * 15}%`,
                    zIndex: floatingCards.length - index
                  }}
                >
                  <div className="relative">
                    <div className="flex items-center justify-center w-12 h-12 mb-4 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl group-hover:animate-bounce">
                      <card.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="mb-2 text-xl font-bold">{card.title}</h3>
                    <p className="text-slate-400">{card.description}</p>
                    
                    <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-r from-primary-500/20 to-accent-500/20 rounded-2xl group-hover:opacity-100"></div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
          className="absolute text-center transform -translate-x-1/2 bottom-8 left-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex justify-center w-6 h-10 mb-2 border-2 rounded-full border-primary-500"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1 h-3 mt-2 rounded-full bg-primary-500"
            />
          </motion.div>
          <p className="text-sm text-slate-400">Scroll to explore</p>
        </motion.div>
      </div>
    </section>
  )
}

export default Hero
