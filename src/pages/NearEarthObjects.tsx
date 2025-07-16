import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Rocket, AlertTriangle, Loader2, ChevronLeft, ChevronRight } from 'lucide-react'
import { nasaAPI } from '../services/api'

const getToday = () => {
  const d = new Date();
  return d.toISOString().split('T')[0];
}
const getNDaysAgo = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split('T')[0];
}

const NearEarthObjects = () => {
  const [startDate, setStartDate] = useState(getNDaysAgo(6))
  const [endDate, setEndDate] = useState(getToday())
  const [allRows, setAllRows] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const rowsPerPage = 50

  // Compute max/min for end date input only if startDate is valid
  let maxEndDate: string | undefined = undefined;
  let minEndDate: string | undefined = undefined;
  if (startDate && !isNaN(Date.parse(startDate))) {
    maxEndDate = getNDaysAgo(0);
    minEndDate = startDate;
  }

  const fetchNEO = async () => {
    setLoading(true)
    setError('')
    setAllRows([])
    try {
      const data = await nasaAPI.getNearEarthObjects(startDate, endDate)
      // Flatten all NEOs into a single array
      const all = Object.values(data.near_earth_objects).flat()
      setAllRows(all)
      setPage(1)
    } catch (e: any) {
      setError('Something went wrong. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const handlePrev = () => setPage(p => Math.max(1, p - 1))
  const handleNext = () => setPage(p => Math.min(totalPages, p + 1))

  const totalPages = Math.ceil(allRows.length / rowsPerPage)
  const pagedRows = allRows.slice((page - 1) * rowsPerPage, page * rowsPerPage)

  // Fetch last 7 days on first mount
  useEffect(() => {
    fetchNEO();
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
            <Rocket className="w-8 h-8 text-stellar-yellow" />
            <h1 className="text-4xl md:text-5xl font-space font-bold text-gradient-stellar">
              Near Earth Objects
            </h1>
          </div>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
            Track asteroids and comets that come close to Earth. Monitor potentially hazardous objects and their trajectories.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-card mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-white font-semibold mb-2">Start Date</label>
              <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cosmic-pink transition-colors" required />
            </div>
            <div>
              <label className="block text-white font-semibold mb-2">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cosmic-pink transition-colors"
                max={maxEndDate}
                min={minEndDate}
              />
            </div>
            <div className="flex items-end">
              <button type="submit" className="cosmic-button w-full">Search</button>
            </div>
          </div>
        </motion.div>
        {loading && (
          <div className="text-center py-12">
            <Loader2 className="w-12 h-12 text-stellar-yellow animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Loading near earth objects...</p>
          </div>
        )}
        {error && !loading && (
          <div className="text-center py-8">
            <AlertTriangle className="w-10 h-10 text-mars-red mx-auto mb-4" />
            <p className="text-gray-400">{error}</p>
          </div>
        )}
        {pagedRows.length > 0 && (
          <>
            <div className="overflow-x-auto mt-8">
              <table className="min-w-full bg-white/5 rounded-xl overflow-hidden">
                <thead>
                  <tr className="text-left text-white">
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Close Approach Date</th>
                    <th className="px-4 py-3">Diameter (m)</th>
                    <th className="px-4 py-3">Miss Distance (km)</th>
                    <th className="px-4 py-3">Hazardous?</th>
                  </tr>
                </thead>
                <tbody>
                  {pagedRows.map((neo: any) => {
                    const approach = neo.close_approach_data[0]
                    return (
                      <tr key={neo.id} className="border-b border-white/10 hover:bg-white/10 transition">
                        <td className="px-4 py-3 text-cosmic-pink font-semibold">
                          <a href={`https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html#/?sstr=${neo.id}`} target="_blank" rel="noopener noreferrer" className="hover:underline">{neo.name}</a>
                        </td>
                        <td className="px-4 py-3">{approach.close_approach_date}</td>
                        <td className="px-4 py-3">{Math.round(neo.estimated_diameter.meters.estimated_diameter_min)} - {Math.round(neo.estimated_diameter.meters.estimated_diameter_max)}</td>
                        <td className="px-4 py-3">{Math.round(Number(approach.miss_distance.kilometers)).toLocaleString()}</td>
                        <td className="px-4 py-3">
                          {neo.is_potentially_hazardous_asteroid ? (
                            <span className="text-mars-red font-bold">Yes</span>
                          ) : (
                            <span className="text-earth-green font-bold">No</span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            {/* Pagination UI (show total pages) */}
            {(() => {
              const pageNum = page;
              return (
                <div className="flex justify-center items-center space-x-4 mt-10">
                  <button
                    onClick={handlePrev}
                    disabled={page <= 1}
                    className="px-4 py-2 rounded-lg bg-cosmic-pink text-white font-semibold shadow hover:bg-cosmic-pink/80 focus:ring-2 focus:ring-cosmic-pink focus:outline-none transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center"
                  >
                    <ChevronLeft className="w-5 h-5" /> Prev
                  </button>
                  <span className="text-white font-semibold">Page {pageNum} / {totalPages}</span>
                  <button
                    onClick={handleNext}
                    className="px-4 py-2 rounded-lg bg-cosmic-pink text-white font-semibold shadow hover:bg-cosmic-pink/80 focus:ring-2 focus:ring-cosmic-pink focus:outline-none transition flex items-center"
                  >
                    Next <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              );
            })()}
          </>
        )}
      </div>
    </div>
  )
}

export default NearEarthObjects 