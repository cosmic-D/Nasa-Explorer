import { useState } from 'react'
import { useQuery } from 'react-query'
import { motion } from 'framer-motion'
import { Calendar, Download, ExternalLink, Loader2, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react'
import { nasaAPI } from '../services/api'
import { format } from 'date-fns'

const APOD = () => {
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const [page, setPage] = useState(1)
  const itemsPerPage = 3

  const { data: apodData, isLoading, error } = useQuery<any, Error>(
    ['apod', selectedDate, startDate, endDate],
    () => nasaAPI.getAPOD(selectedDate, startDate, endDate),
    {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    }
  )

  const handleDateChange = (date: string) => {
    setSelectedDate(date)
    setStartDate('')
    setEndDate('')
    setPage(1)
  }

  const handleRangeChange = (start: string, end: string) => {
    setStartDate(start)
    setEndDate(end)
    setSelectedDate('')
    setPage(1)
  }

  const handlePrevPage = () => setPage(p => Math.max(1, p - 1))
  const handleNextPage = () => setPage(p => Math.min(totalPages, p + 1))

  const today = new Date().toISOString().split('T')[0]

  // Calculate pagination for multiple APODs
  const isMultipleAPODs = Array.isArray(apodData)
  const totalPages = isMultipleAPODs ? Math.ceil(apodData.length / itemsPerPage) : 1
  const pagedAPODs = isMultipleAPODs ? apodData.slice((page - 1) * itemsPerPage, page * itemsPerPage) : apodData

  let errorMessage = 'Failed to load APOD data.';
  if (error && error instanceof Error) {
    if (
      error.message.includes('500') ||
      error.message.toLowerCase().includes('internal server error')
    ) {
      errorMessage = 'Something went wrong. Please try again later.';
    } else {
      errorMessage = error.message;
    }
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-space font-bold text-gradient mb-4">
            Astronomy Picture of the Day
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Discover the cosmos! Each day a different image or photograph of our fascinating universe 
            is featured, along with a brief explanation written by a professional astronomer.
          </p>
        </motion.div>

        {/* Date Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-card mb-8"
        >
          <div className="flex items-center space-x-3 mb-6">
            <Calendar className="w-6 h-6 text-cosmic-pink" />
            <h2 className="text-2xl font-space font-bold text-gradient">Select Date</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Single Date */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Single Date</h3>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => handleDateChange(e.target.value)}
                max={today}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cosmic-pink transition-colors"
              />
              <button
                onClick={() => handleDateChange(today)}
                className="cosmic-button w-full"
              >
                Today's Picture
              </button>
            </div>

            {/* Date Range */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Date Range</h3>
              <div className="space-y-3">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => handleRangeChange(e.target.value, endDate)}
                  max={today}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cosmic-pink transition-colors"
                  placeholder="Start Date"
                />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => handleRangeChange(startDate, e.target.value)}
                  max={today}
                  min={startDate}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cosmic-pink transition-colors"
                  placeholder="End Date"
                />
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => handleDateChange(format(new Date(Date.now() - 24 * 60 * 60 * 1000), 'yyyy-MM-dd'))}
                  className="stellar-button w-full"
                >
                  Yesterday
                </button>
                <button
                  onClick={() => handleDateChange(format(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'))}
                  className="earth-button w-full"
                >
                  Last Week
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <Loader2 className="w-12 h-12 text-cosmic-pink animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Loading cosmic wonders...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <AlertTriangle className="w-12 h-12 text-mars-red mx-auto mb-4" />
            <p className="text-gray-400">{errorMessage}</p>
          </div>
        )}

        {/* APOD Content */}
        {apodData && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Results count for multiple APODs */}
            {isMultipleAPODs && (
              <div className="text-right text-gray-400 text-sm mb-4">
                Showing {pagedAPODs.length} of {apodData.length} APODs
              </div>
            )}
            
            {Array.isArray(pagedAPODs) ? (
              // Multiple APODs (date range)
              <div className="space-y-8">
                {pagedAPODs.map((apod, index) => (
                  <APODCard key={apod.date} apod={apod} index={index} />
                ))}
              </div>
            ) : (
              // Single APOD
              <APODCard apod={pagedAPODs} index={0} />
            )}

            {/* Pagination for multiple APODs */}
            {isMultipleAPODs && totalPages > 1 && (
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
          </motion.div>
        )}
      </div>
    </div>
  )
}

interface APODCardProps {
  apod: any
  index: number
}

const APODCard = ({ apod, index }: APODCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="space-card"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Content */}
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-space font-bold text-white mb-4">
              {apod.title}
            </h2>
            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
              <span>{format(new Date(apod.date), 'MMMM d, yyyy')}</span>
              {apod.copyright && (
                <span>© {apod.copyright}</span>
              )}
            </div>
            <p className="text-gray-400 leading-relaxed text-lg">
              {apod.explanation}
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-4">
            {apod.hdurl && (
              <a
                href={apod.hdurl}
                target="_blank"
                rel="noopener noreferrer"
                className="cosmic-button flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Download HD</span>
              </a>
            )}
            <a
              href="https://apod.nasa.gov/apod/astropix.html"
              target="_blank"
              rel="noopener noreferrer"
              className="stellar-button flex items-center space-x-2"
            >
              <ExternalLink className="w-4 h-4" />
              <span>View on NASA</span>
            </a>
          </div>
        </div>

        {/* Media */}
        <div className="relative">
          {apod.media_type === 'image' ? (
            <div className="space-y-4">
              <img
                src={apod.url}
                alt={apod.title}
                className="w-full h-96 lg:h-[500px] object-cover rounded-lg"
              />
              {apod.hdurl && apod.hdurl !== apod.url && (
                <p className="text-sm text-gray-500 text-center">
                  Click "Download HD" for high-resolution version
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <video
                src={apod.url}
                controls
                className="w-full h-96 lg:h-[500px] object-cover rounded-lg"
              />
              <p className="text-sm text-gray-500 text-center">
                Video content from NASA
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default APOD 