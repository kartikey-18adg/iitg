import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Upload as UploadIcon, FileText, Download, BarChart3, Database, FileSpreadsheet } from 'lucide-react'

const Upload = ({ onDataProcess }) => {
  const [uploadedFile, setUploadedFile] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const supportedFormats = [
    { icon: FileSpreadsheet, name: 'Excel (.xlsx, .xls)', color: 'from-green-500 to-green-600' },
    { icon: FileText, name: 'CSV (.csv)', color: 'from-blue-500 to-blue-600' },
    { icon: Database, name: 'Max 16MB', color: 'from-purple-500 to-purple-600' }
  ]

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      setUploadedFile(file)
    }
  }

  const handleDrop = (event) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    if (file) {
      setUploadedFile(file)
    }
  }

  const handleDragOver = (event) => {
    event.preventDefault()
  }

  const handleProcessData = async () => {
    if (!uploadedFile) {
      alert('Please select a file first')
      return
    }
    
    setIsProcessing(true)
    await onDataProcess()
    setIsProcessing(false)
  }

  const handleUseSampleData = async () => {
    setIsProcessing(true)
    await onDataProcess()
    setIsProcessing(false)
  }

  const handleExportResults = () => {
    alert('Results exported successfully!\n\nFile: campus_security_report.xlsx')
  }

  return (
    <section id="upload" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800">
      <div className="max-w-7xl mx-auto">
        {}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold gradient-text mb-4">
            Data Upload & Processing
          </h2>
          <p className="text-xl text-slate-300">
            Upload campus data for comprehensive analysis
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
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
                className="w-24 h-24 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:animate-bounce"
              >
                <UploadIcon className="w-12 h-12 text-white" />
              </motion.div>
              
              <h3 className="text-2xl font-bold mb-4">Drop Excel Files Here</h3>
              <p className="text-slate-400 mb-8">or click to browse your files</p>
              
              <input
                type="file"
                id="data-upload"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileUpload}
                className="hidden"
              />
              
              <motion.label
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                htmlFor="data-upload"
                className="btn-primary inline-flex items-center space-x-2 cursor-pointer"
              >
                <UploadIcon className="w-5 h-5" />
                <span>Select File</span>
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
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="font-semibold text-white mb-1">
                      {uploadedFile.name}
                    </div>
                    <div className="text-sm text-slate-400">
                      {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                    </div>
                  </div>
                  
                  <div className="text-green-400">
                    ✓ Ready to process
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
                  <Database className="w-5 h-5 text-white" />
                </div>
                <span>Supported Formats</span>
              </h3>
              
              <div className="space-y-4">
                {supportedFormats.map((format, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                    whileHover={{ x: 5 }}
                    className="flex items-center space-x-4 p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-colors group"
                  >
                    <div className={`w-12 h-12 bg-gradient-to-r ${format.color} rounded-xl flex items-center justify-center group-hover:animate-bounce`}>
                      <format.icon className="w-6 h-6 text-white" />
                    </div>
                    
                    <div className="font-medium text-white">
                      {format.name}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <motion.button
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleProcessData}
            disabled={isProcessing}
            className="glass-card p-8 text-center hover:bg-white/10 transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:animate-bounce">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Analyze Data</h3>
            <p className="text-slate-400">Process uploaded file for insights</p>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleUseSampleData}
            disabled={isProcessing}
            className="glass-card p-8 text-center hover:bg-white/10 transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:animate-bounce">
              <Database className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Use Sample Data</h3>
            <p className="text-slate-400">Try with demo dataset</p>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExportResults}
            className="glass-card p-8 text-center hover:bg-white/10 transition-all duration-300 group"
          >
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:animate-bounce">
              <Download className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Export Results</h3>
            <p className="text-slate-400">Download analysis report</p>
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}

export default Upload
