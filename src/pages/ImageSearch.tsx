import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Loader2, AlertTriangle } from 'lucide-react'
import { nasaAPI } from '../services/api'

const ImageSearch = () => {
  const [query, setQuery] = useState('Mars')
  const [mediaType, setMediaType] = useState('image')
  const [yearStart, setYearStart] = useState('')
  const [yearEnd, setYearEnd] = useState('')
  const [page, setPage] = useState(1)
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchSearch = async (pageOverride?: number) => {
    setLoading(true)
    setError('')
    setData(null)
    try {
      const yearStartNum = yearStart ? parseInt(yearStart) : undefined
      const yearEndNum = yearEnd ? parseInt(yearEnd) : undefined
      const data = await nasaAPI.searchNASAImages(
        query,
        mediaType,
        yearStartNum,
        yearEndNum,
        pageOverride || page
      )
      setData(data)
    } catch (e: any) {
      setError(e.message || 'Something went wrong. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // On initial load, trigger a default search if query is set
    fetchSearch(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query) {
      setError('Please enter a search term')
      return
    }
    setPage(1)
    fetchSearch(1)
  }

  const handlePage = (newPage: number) => {
    setPage(newPage)
    fetchSearch(newPage)
  }

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
            <Search className="w-8 h-8 text-nebula-cyan" />
            <h1 className="text-4xl md:text-5xl font-space font-bold text-gradient mb-4">
              NASA Image & Video Library
            </h1>
          </div>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
            Search through NASA's vast collection of images and videos. Discover stunning visuals from space missions, research, and exploration.
          </p>
        </motion.div>
        <form onSubmit={handleSubmit} className="w-full mb-8 bg-white/5 rounded-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="flex-1">
              <label className="block text-white font-semibold mb-2">Search</label>
              <input type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder="e.g. Mars, Hubble, Saturn..." className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cosmic-pink transition-colors" required />
            </div>
            <div>
              <label className="block text-white font-semibold mb-2">Media Type</label>
              <select value={mediaType} onChange={e => setMediaType(e.target.value)} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cosmic-pink transition-colors">
                <option value="image" className="text-black">Image</option>
                <option value="video" className="text-black">Video</option>
              </select>
            </div>
            <div>
              <label className="block text-white font-semibold mb-2">Year Start</label>
              <input type="number" value={yearStart} onChange={e => setYearStart(e.target.value)} placeholder="e.g. 2010" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cosmic-pink transition-colors" min="1900" max="2100" />
            </div>
            <div>
              <label className="block text-white font-semibold mb-2">Year End</label>
              <input type="number" value={yearEnd} onChange={e => setYearEnd(e.target.value)} placeholder="e.g. 2023" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cosmic-pink transition-colors" min="1900" max="2100" />
            </div>
            <div className="flex items-end">
              <button type="submit" className="cosmic-button w-full">Search</button>
            </div>
          </div>
        </form>
        {loading && (
          <div className="text-center py-12">
            <Loader2 className="w-12 h-12 text-nebula-cyan animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Loading search results...</p>
          </div>
        )}
        {error && !loading && (
          <div className="text-center py-8">
            <AlertTriangle className="w-10 h-10 text-mars-red mx-auto mb-4" />
            <p className="text-gray-400">{error}</p>
          </div>
        )}
        {data && data.collection && data.collection.items && data.collection.items.length > 0 && (
          <>
            <div className="text-right text-gray-400 text-sm mb-2">
              {data.collection.metadata && data.collection.metadata.total_hits && (
                <span>
                  Showing page {page} of {Math.ceil(data.collection.metadata.total_hits / 100)} ({data.collection.metadata.total_hits} results)
                </span>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
              {data.collection.items.map((item: any) => {
                const d = item.data[0]
                const link = item.links && item.links[0] ? item.links[0].href : ''
                return (
                  <div key={item.data[0].nasa_id} className="space-card flex flex-col items-center">
                    {mediaType === 'image' && link && (
                      <img src={link} alt={d.title} className="w-full h-64 object-cover rounded-lg mb-4" loading="lazy" />
                    )}
                    {mediaType === 'video' && link && (
                      <video src={link} controls className="w-full h-64 object-cover rounded-lg mb-4" />
                    )}
                    <div className="text-white font-semibold mb-1 text-center">{d.title}</div>
                    <div className="text-gray-400 text-sm mb-2 text-center">{d.description?.slice(0, 120) || ''}{d.description && d.description.length > 120 ? '...' : ''}</div>
                    <a href={d.url || link} target="_blank" rel="noopener noreferrer" className="cosmic-button py-2 px-4 text-sm">View</a>
                  </div>
                )
              })}
            </div>
          </>
        )}
        {data && data.collection && data.collection.items && data.collection.items.length === 0 && !loading && !error && (
          <div className="text-center py-8">
            <p className="text-gray-400">No results found.</p>
          </div>
        )}
        {data && data.collection && (
          <div className="flex justify-center mt-8 space-x-2">
            <button disabled={page <= 1} onClick={() => handlePage(page - 1)} className="cosmic-button disabled:opacity-50">Previous</button>
            <span className="text-white font-semibold px-4 py-2">
              Page {page}
              {data.collection.metadata && data.collection.metadata.total_hits && (
                <> of {Math.ceil(data.collection.metadata.total_hits / 100)}</>
              )}
            </span>
            <button
              disabled={
                !data.collection.metadata ||
                !data.collection.metadata.total_hits ||
                page >= Math.ceil(data.collection.metadata.total_hits / 100)
              }
              onClick={() => handlePage(page + 1)}
              className="cosmic-button disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ImageSearch 