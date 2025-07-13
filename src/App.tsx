import { Routes, Route } from 'react-router-dom'
import { motion } from 'framer-motion'
import Header from './components/Header'
import Footer from './components/Footer'
import Dashboard from './pages/Dashboard'
import APOD from './pages/APOD'
import MarsRover from './pages/MarsRover'
import NearEarthObjects from './pages/NearEarthObjects'
import EPIC from './pages/EPIC'
import ImageSearch from './pages/ImageSearch'
import NotFound from './pages/NotFound'

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/apod" element={<APOD />} />
            <Route path="/mars-rover" element={<MarsRover />} />
            <Route path="/neo" element={<NearEarthObjects />} />
            <Route path="/epic" element={<EPIC />} />
            <Route path="/search" element={<ImageSearch />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  )
}

export default App 