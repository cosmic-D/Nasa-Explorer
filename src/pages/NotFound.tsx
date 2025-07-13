import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Rocket, Home, ArrowLeft } from 'lucide-react'

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          {/* 404 Animation */}
          <motion.div
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="flex justify-center"
          >
            <div className="w-32 h-32 bg-gradient-to-r from-cosmic-pink to-nebula-cyan rounded-full flex items-center justify-center">
              <Rocket className="w-16 h-16 text-white" />
            </div>
          </motion.div>

          {/* Text Content */}
          <div className="space-y-4">
            <h1 className="text-6xl md:text-8xl font-space font-bold text-gradient">
              404
            </h1>
            <h2 className="text-3xl md:text-4xl font-space font-bold text-white">
              Page Not Found
            </h2>
            <p className="text-xl text-gray-400 max-w-md mx-auto">
              Looks like this page has drifted off into deep space. 
              Let's get you back to exploring the cosmos!
            </p>
          </div>

          {/* Navigation */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="cosmic-button flex items-center justify-center space-x-2"
            >
              <Home className="w-4 h-4" />
              <span>Go Home</span>
            </Link>
            <button
              onClick={() => window.history.back()}
              className="stellar-button flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Go Back</span>
            </button>
          </div>

          {/* Fun Facts */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-12 p-6 glass-effect rounded-xl"
          >
            <h3 className="text-lg font-semibold text-white mb-4">
              While you're here, did you know?
            </h3>
            <p className="text-gray-400">
              The universe is expanding at a rate of about 73 kilometers per second per megaparsec. 
              That means for every 3.26 million light-years away a galaxy is, it appears to be moving 
              73 kilometers per second faster than galaxies that are closer to us.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default NotFound 