import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Camera, Loader2, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react'
import { nasaAPI } from '../services/api'

const getToday = () => {
  const d = new Date();
  return d.toISOString().split('T')[0];
}

const EPIC = () => {
  const [date, setDate] = useState(getToday())
  const [type, setType] = useState<'natural' | 'enhanced'>('natural')
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const itemsPerPage = 12

  const fetchEPIC = async () => {
    setLoading(true)
    setError('')
    setData([])
    try {
      const data = await nasaAPI.getEPICImages(date, type)
      setData(data)
      setPage(1)
    } catch (e: any) {
      setError('Something went wrong. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    fetchEPIC()
  }

  const handlePrevPage = () => setPage(p => Math.max(1, p - 1))
  const handleNextPage = () => setPage(p => Math.min(totalPages, p + 1))

  const totalPages = Math.ceil(data.length / itemsPerPage)
  const pagedData = data.slice((page - 1) * itemsPerPage, page * itemsPerPage)

  // Fetch today's images on first load
  useEffect(() => {
    fetchEPIC();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center space-x-3 mb-6">
            <Camera className="w-8 h-8 text-earth-green" />
            <h1 className="text-4xl md:text-5xl font-space font-bold text-gradient mb-4">
              EPIC Earth Images
            </h1>
          </div>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
            View stunning images of Earth from the DSCOVR satellite. See our beautiful planet from a million miles away.
          </p>
        </motion.div>
        <form onSubmit={handleSubmit} className="w-full mb-8 bg-white/5 rounded-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-white font-semibold mb-2">Date</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cosmic-pink transition-colors" />
            </div>
            <div>
              <label className="block text-white font-semibold mb-2">Type</label>
              <select value={type} onChange={e => setType(e.target.value as 'natural' | 'enhanced')} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cosmic-pink transition-colors">
                <option value="natural" className="text-black">Natural</option>
                <option value="enhanced" className="text-black">Enhanced</option>
              </select>
            </div>
            <div className="flex items-end">
              <button type="submit" className="cosmic-button w-full">Search</button>
            </div>
          </div>
        </form>
        {loading && (
          <div className="text-center py-12">
            <Loader2 className="w-12 h-12 text-earth-green animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Loading EPIC images...</p>
          </div>
        )}
        {error && !loading && (
          <div className="text-center py-8">
            <AlertTriangle className="w-10 h-10 text-mars-red mx-auto mb-4" />
            <p className="text-gray-400">{error}</p>
          </div>
        )}
        {pagedData && pagedData.length > 0 && (
          <>
            <div className="text-right text-gray-400 text-sm mb-4">
              Showing {pagedData.length} of {data.length} images
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
              {pagedData.map((img: any) => {
                // Construct image URL per NASA docs
                // https://epic.gsfc.nasa.gov/about/using-epic-api
                const d = img.date.split(' ')[0].replace(/-/g, '/')
                const url = type === 'enhanced'
                  ? `https://epic.gsfc.nasa.gov/archive/enhanced/${d}/png/${img.image}.png`
                  : `https://epic.gsfc.nasa.gov/archive/natural/${d}/png/${img.image}.png`
                return (
                  <div key={img.identifier} className="space-card flex flex-col items-center">
                    <img src={url} alt={img.caption} className="w-full h-64 object-cover rounded-lg mb-4" loading="lazy" />
                    <div className="text-white font-semibold mb-1">{img.caption || img.image}</div>
                    <div className="text-gray-400 text-sm mb-2">{img.date}</div>
                    <a href={url} target="_blank" rel="noopener noreferrer" className="earth-button py-2 px-4 text-sm">Download</a>
                  </div>
                )
              })}
            </div>
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-4 mt-10">
                <button
                  onClick={handlePrevPage}
                  disabled={page <= 1}
                  className="px-4 py-2 rounded-lg bg-cosmic-pink text-white font-semibold shadow hover:bg-cosmic-pink/80 focus:ring-2 focus:ring-cosmic-pink focus:outline-none transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center"
                >
                  <ChevronLeft className="w-5 h-5" /> Prev
                </button>
                <span className="text-white font-semibold">Page {page} of {totalPages}</span>
                <button
                  onClick={handleNextPage}
                  disabled={page >= totalPages}
                  className="px-4 py-2 rounded-lg bg-cosmic-pink text-white font-semibold shadow hover:bg-cosmic-pink/80 focus:ring-2 focus:ring-cosmic-pink focus:outline-none transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center"
                >
                  Next <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        )}
        {data.length === 0 && !loading && !error && (
          <div className="text-center py-8">
            <p className="text-gray-400">No images found for the selected date.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default EPIC 