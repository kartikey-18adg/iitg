import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Video, Upload, Check, AlertCircle, Eye, Brain, Zap, Shield } from 'lucide-react'

const CCTV = () => {
  const [uploadedFile, setUploadedFile] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const features = [
    { icon: Eye, title: 'Face Recognition', description: 'Advanced facial recognition technology' },
    { icon: Brain, title: 'Person Tracking', description: 'Real-time person tracking across cameras' },
    { icon: Zap, title: 'Behavior Analysis', description: 'AI-powered behavior pattern analysis' },
    { icon: Shield, title: 'Real-time Alerts', description: 'Instant notifications for security threats' }
  ]

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      setUploadedFile(file)
      setIsProcessing(true)
      
      setTimeout(() => {
        setIsProcessing(false)
      }, 3000)
    }
  }

  const handleDrop = (event) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    if (file) {
      setUploadedFile(file)
      setIsProcessing(true)
      
      setTimeout(() => {
        setIsProcessing(false)
      }, 3000)
    }
  }

  const handleDragOver = (event) => {
    event.preventDefault()
  }

  return (
    <section id="cctv" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold gradient-text mb-4">
            CCTV & Face Detection
          </h2>
          <p className="text-xl text-slate-300">
            Upload footage or images for AI-powered identification
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="glass-card p-12 text-center border-2 border-dashed border-white/20 hover:border-primary-500 transition-colors cursor-pointer group"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="w-20 h-20 bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:animate-bounce"
              >
                <Video className="w-10 h-10 text-white" />
              </motion.div>
              
              <h3 className="text-2xl font-bold mb-4">Drop CCTV Footage Here</h3>
              <p className="text-slate-400 mb-8">Supported: MP4, AVI, MOV, JPG, PNG</p>
              
              <input
                type="file"
                id="cctv-upload"
                accept="video/*,image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              
              <motion.label
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                htmlFor="cctv-upload"
                className="btn-primary inline-flex items-center space-x-2 cursor-pointer"
              >
                <Upload className="w-5 h-5" />
                <span>Choose File</span>
              </motion.label>
            </div>

            {}
            {uploadedFile && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-6"
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    isProcessing 
                      ? 'bg-orange-500 animate-pulse' 
                      : 'bg-green-500'
                  }`}>
                    {isProcessing ? (
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Check className="w-6 h-6 text-white" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="font-semibold text-white mb-1">
                      {uploadedFile.name}
                    </div>
                    <div className="text-sm text-slate-400">
                      {isProcessing ? 'Processing...' : 'Upload Complete'}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>

          {}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            <div className="glass-card p-8">
              <h3 className="text-2xl font-bold mb-6 flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <span>AI Detection Features</span>
              </h3>
              
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                    whileHover={{ x: 5 }}
                    className="flex items-center space-x-4 p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-colors group"
                  >
                    <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl flex items-center justify-center group-hover:animate-bounce">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    
                    <div>
                      <div className="font-semibold text-white mb-1">
                        {feature.title}
                      </div>
                      <div className="text-sm text-slate-400">
                        {feature.description}
                      </div>
                    </div>
                    
                    <div className="ml-auto">
                      <Check className="w-5 h-5 text-green-400" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {}
            {isProcessing && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card p-6"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center animate-pulse">
                    <AlertCircle className="w-6 h-6 text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="font-semibold text-white mb-1">
                      AI Processing in Progress
                    </div>
                    <div className="text-sm text-slate-400">
                      Analyzing footage for faces, objects, and behaviors...
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 bg-slate-700 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 3, ease: 'easeInOut' }}
                    className="bg-gradient-to-r from-primary-500 to-accent-500 h-2 rounded-full"
                  />
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default CCTV
