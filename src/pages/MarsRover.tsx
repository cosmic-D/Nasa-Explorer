import { useState, useEffect, useRef } from 'react'
import { useQuery } from 'react-query'
import { motion } from 'framer-motion'
import { Globe, Camera, Calendar, ChevronLeft, ChevronRight, Loader2, AlertTriangle } from 'lucide-react'
import { nasaAPI } from '../services/api'
import { MarsRoverPhoto, type MarsRover, MarsRoversResponse } from '../types/nasa'

const ROVER_OPTIONS = ['curiosity', 'opportunity', 'spirit']

const MarsRover = () => {
  const [rover, setRover] = useState<string>('curiosity')
  const [sol, setSol] = useState<string>('')
  const [earthDate, setEarthDate] = useState<string>('')
  const [camera, setCamera] = useState<string>('')
  const [page, setPage] = useState<number>(1)
  const [availableCameras, setAvailableCameras] = useState<{ name: string; full_name: string }[]>([])

  // Debounce sol value
  const [debouncedSol, setDebouncedSol] = useState<string>('');
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      setDebouncedSol(sol);
    }, 500);
    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };
  }, [sol]);

  // Fetch available rovers (for camera list)
  const { data: roversData } = useQuery<MarsRoversResponse, Error>(['marsRovers'], nasaAPI.getMarsRovers)

  // Update available cameras when rover changes
  useEffect(() => {
    if (roversData) {
      const found = roversData.rovers.find(r => r.name.toLowerCase() === rover)
      setAvailableCameras(found ? found.cameras : [])
      setCamera('')
    }
  }, [rover, roversData])

  // Fetch photos
  const { data, isFetching, error, refetch } = useQuery<any, Error>(
    ['marsRoverPhotos', rover, debouncedSol, earthDate, camera, page],
    () => {
      // Use default sol value if no sol or earthDate is provided
      let solParam: number | undefined;
      let earthDateParam: string | undefined;
      
      if (debouncedSol !== '') {
        solParam = parseInt(debouncedSol);
      } else if (earthDate !== '') {
        earthDateParam = earthDate;
      } else {
        // Default sol value for initial load (Curiosity's recent sol)
        solParam = 4000;
      }
      
      return nasaAPI.getMarsRoverPhotos(
        rover,
        solParam,
        earthDateParam,
        camera || undefined,
        page
      );
    },
    { keepPreviousData: true, enabled: !!rover }
  )

  // On initial load, trigger a fetch for the default rover
  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handlers
  const handleRoverChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRover(e.target.value)
    setSol('')
    setEarthDate('')
    setPage(1)
  }
  const handleCameraChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCamera(e.target.value)
    setPage(1)
  }
  const handleSolChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSol(e.target.value)
    setEarthDate('')
    setPage(1)
  }
  const handleEarthDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEarthDate(e.target.value)
    setSol('')
    setPage(1)
  }
  const handlePrevPage = () => setPage(p => Math.max(1, p - 1))
  const handleNextPage = () => setPage(p => p + 1)

  // UI
  let errorMessage = 'Failed to load Mars rover photos.';
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center space-x-3 mb-6">
            <Globe className="w-8 h-8 text-mars-red" />
            <h1 className="text-4xl md:text-5xl font-space font-bold text-gradient-stellar">
              Mars Rover Photos
            </h1>
          </div>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
            Explore the surface of Mars through the eyes of NASA's rovers. View stunning images from Curiosity, Opportunity, and Spirit.
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-card mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Rover */}
            <div>
              <label className="block text-white font-semibold mb-2">Rover</label>
              <select
                value={rover}
                onChange={handleRoverChange}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cosmic-pink transition-colors"
              >
                {ROVER_OPTIONS.map(r => (
                  <option key={r} value={r} className="text-black">{r.charAt(0).toUpperCase() + r.slice(1)}</option>
                ))}
              </select>
            </div>
            {/* Camera */}
            <div>
              <label className="block text-white font-semibold mb-2">Camera</label>
              <select
                value={camera}
                onChange={handleCameraChange}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cosmic-pink transition-colors"
              >
                <option value="" className="text-black">All</option>
                {availableCameras.map(cam => (
                  <option key={cam.name} value={cam.name} className="text-black">{cam.full_name}</option>
                ))}
              </select>
            </div>
            {/* Sol */}
            <div>
              <label className="block text-white font-semibold mb-2">Martian Sol</label>
              <input
                type="number"
                min={0}
                value={sol}
                onChange={handleSolChange}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cosmic-pink transition-colors"
                placeholder="e.g. 1000"
              />
            </div>
            {/* Earth Date */}
            <div>
              <label className="block text-white font-semibold mb-2">Earth Date</label>
              <input
                type="date"
                value={earthDate}
                onChange={handleEarthDateChange}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cosmic-pink transition-colors"
                placeholder="YYYY-MM-DD"
              />
            </div>
          </div>
        </motion.div>

        {/* Loading */}
        {isFetching && (
          <div className="text-center py-12">
            <Loader2 className="w-12 h-12 text-cosmic-pink animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Loading cosmic wonders...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center py-12">
            <AlertTriangle className="w-12 h-12 text-mars-red mx-auto mb-4" />
            <p className="text-gray-400">{errorMessage}</p>
          </div>
        )}

        {/* Photos */}
        {data && data.photos.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Results count */}
            <div className="text-right text-gray-400 text-sm mb-4">
              Showing {data.photos.length} photos
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {data.photos.map((photo: MarsRoverPhoto) => (
                <div key={photo.id} className="space-card flex flex-col">
                  <img src={photo.img_src} alt={photo.camera.full_name} className="rounded-lg mb-4 w-full h-56 object-cover bg-black" loading="lazy" />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Camera className="w-4 h-4 text-cosmic-pink" />
                      <span className="text-sm text-white font-semibold">{photo.camera.full_name}</span>
                    </div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Calendar className="w-4 h-4 text-cosmic-pink" />
                      <span className="text-sm text-gray-400">{photo.earth_date}</span>
                    </div>
                    <div className="text-xs text-gray-500">Sol: {photo.sol}</div>
                    <div className="text-xs text-gray-500">Rover: {photo.rover.name}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* No photos found */}
        {data && data.photos.length === 0 && !isFetching && !error && (
          <div className="text-center py-12">
            <p className="text-gray-400">No photos found for the selected criteria.</p>
          </div>
        )}

        {/* Pagination */}
        {data && data.photos.length > 0 && (
          <div className="flex justify-center items-center space-x-4 mt-10">
            <button
              onClick={handlePrevPage}
              disabled={page === 1}
              className="px-4 py-2 rounded-lg bg-cosmic-pink text-white font-semibold shadow hover:bg-cosmic-pink/80 focus:ring-2 focus:ring-cosmic-pink focus:outline-none transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center"
            >
              <ChevronLeft className="w-5 h-5" /> Prev
            </button>
            <span className="text-white font-semibold">
              Page {page}
              {data.photos.length < 25 && page > 1 && " (Last page)"}
            </span>
            <button
              onClick={handleNextPage}
              disabled={data.photos.length < 25}
              className="px-4 py-2 rounded-lg bg-cosmic-pink text-white font-semibold shadow hover:bg-cosmic-pink/80 focus:ring-2 focus:ring-cosmic-pink focus:outline-none transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center"
            >
              Next <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default MarsRover 