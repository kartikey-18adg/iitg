import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navigation from './components/Navigation'
import Hero from './components/Hero'
import Dashboard from './components/Dashboard'
import Analytics from './components/Analytics'
import CCTV from './components/CCTV'
import Upload from './components/Upload'
import DataTable from './components/DataTable'
import Footer from './components/Footer'
import LoadingOverlay from './components/LoadingOverlay'
import ParticleBackground from './components/ParticleBackground'

function App() {
  const [currentSection, setCurrentSection] = useState('home')
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState([])

  useEffect(() => {
    generateSampleData()
  }, [])

  const generateSampleData = () => {
    const activities = ['Entry', 'Exit', 'Card Swipe', 'WiFi Login', 'Lab Access', 'Library Check-in']
    const buildings = ['Main Building', 'Library', 'Lab A', 'Lab B', 'Cafeteria', 'Gym', 'Dorm A', 'Dorm B']
    const sampleData = []
    
    for (let i = 0; i < 150; i++) {
      const isAnomaly = Math.random() > 0.85
      const timestamp = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
      
      sampleData.push({
        id: `REC${String(i + 1).padStart(6, '0')}`,
        timestamp: timestamp,
        entityId: `ENT_${String(Math.floor(Math.random() * 50)).padStart(3, '0')}`,
        location: buildings[Math.floor(Math.random() * buildings.length)],
        activity: activities[Math.floor(Math.random() * activities.length)],
        score: isAnomaly ? -0.8 - Math.random() * 0.6 : 0.2 + Math.random() * 0.3,
        isAnomaly: isAnomaly,
        duration: Math.floor(Math.random() * 180) + 5
      })
    }
    
    setData(sampleData.sort((a, b) => b.timestamp - a.timestamp))
  }

  const handleSectionChange = (section) => {
    setCurrentSection(section)
  }

  const handleDataProcess = async () => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    generateSampleData()
    setIsLoading(false)
    setCurrentSection('dashboard')
  }

  const scrollToSection = (sectionId) => {
    setCurrentSection(sectionId)
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white overflow-x-hidden">
      <ParticleBackground />
      
      <Navigation 
        currentSection={currentSection} 
        onSectionChange={handleSectionChange}
        onScrollToSection={scrollToSection}
      />
      
      <AnimatePresence mode="wait">
        {currentSection === 'home' && (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Hero onScrollToSection={scrollToSection} />
          </motion.div>
        )}
        
        {currentSection === 'dashboard' && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Dashboard data={data} />
          </motion.div>
        )}
        
        {currentSection === 'analytics' && (
          <motion.div
            key="analytics"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Analytics data={data} />
          </motion.div>
        )}
        
        {currentSection === 'cctv' && (
          <motion.div
            key="cctv"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <CCTV />
          </motion.div>
        )}
        
        {currentSection === 'upload' && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Upload onDataProcess={handleDataProcess} />
          </motion.div>
        )}
      </AnimatePresence>
      
      <DataTable data={data} />
      <Footer onScrollToSection={scrollToSection} />
      
      <LoadingOverlay isLoading={isLoading} />
    </div>
  )
}

export default App
