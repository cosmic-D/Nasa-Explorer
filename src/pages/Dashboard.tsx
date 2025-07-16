import { useQuery } from 'react-query'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Rocket, Camera, Globe, AlertTriangle, Loader2 } from 'lucide-react'
import { nasaAPI } from '../services/api'
import { format } from 'date-fns'
import { MarsRoverPhoto } from '../types/nasa'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Legend } from 'recharts'

const Dashboard = () => {
  const { ref: apodRef, inView: apodInView } = useInView({ triggerOnce: true })
  const { ref: marsRoverRef, inView: marsRoverInView } = useInView({ triggerOnce: true })
  const { ref: neoRef, inView: neoInView } = useInView({ triggerOnce: true })

  const { data: dashboardData, isLoading, error } = useQuery(
    'dashboard',
    nasaAPI.getDashboard,
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    }
  )

  const marsRoverData = dashboardData?.marsRoverData;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-cosmic-pink animate-spin mx-auto" />
          <p className="text-gray-400">Loading cosmic data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <AlertTriangle className="w-12 h-12 text-mars-red mx-auto" />
          <p className="text-gray-400">Failed to load dashboard data</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-2xl sm:text-4xl md:text-6xl font-space font-bold text-gradient mb-4">
            Welcome to NASA Space Explorer
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">
            Discover the wonders of space through NASA's vast collection of astronomical data, 
            images, and discoveries. Explore the cosmos with interactive visualizations.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <div className="flex items-center space-x-2 text-cosmic-pink">
              <Camera className="w-5 h-5" />
              <span>Astronomy Picture of the Day</span>
            </div>
            <div className="flex items-center space-x-2 text-earth-green">
              <Globe className="w-5 h-5" />
              <span>Mars Rover Photos</span>
            </div>
            <div className="flex items-center space-x-2 text-stellar-yellow">
              <Rocket className="w-5 h-5" />
              <span>Near Earth Objects</span>
            </div>
          </div>
        </motion.div>

        {/* APOD Section */}
        <motion.div
          ref={apodRef}
          initial={{ opacity: 0, y: 20 }}
          animate={apodInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="space-card">
            <div className="flex items-center space-x-3 mb-6">
              <Camera className="w-6 h-6 text-cosmic-pink" />
              <h2 className="text-2xl font-space font-bold text-gradient">
                Astronomy Picture of the Day
              </h2>
            </div>
            
            {dashboardData?.apod ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-white">
                    {dashboardData.apod.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {dashboardData.apod.explanation}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{format(new Date(dashboardData.apod.date), 'MMMM d, yyyy')}</span>
                    {dashboardData.apod.copyright && (
                      <span>© {dashboardData.apod.copyright}</span>
                    )}
                  </div>
                </div>
                <div className="relative">
                  {dashboardData.apod.media_type === 'image' ? (
                    <img
                      src={dashboardData.apod.url}
                      alt={dashboardData.apod.title}
                      className="w-full h-64 lg:h-80 object-cover rounded-lg"
                    />
                  ) : (
                    <video
                      src={dashboardData.apod.url}
                      controls
                      className="w-full h-64 lg:h-80 object-cover rounded-lg"
                    />
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <AlertTriangle className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                {typeof dashboardData?.errors?.apod === 'string' &&
                  /rate limit|429/i.test(dashboardData.errors.apod) ? (
                  <>
                    <p className="text-lg text-mars-red font-semibold mb-2">NASA API Rate Limit Exceeded</p>
                    <p className="text-gray-400 mb-2">You've made too many requests to the NASA API. Please try again in a few minutes.</p>
                    <a href="https://api.nasa.gov/contact/" target="_blank" rel="noopener noreferrer" className="underline text-cosmic-pink">Contact NASA API Support</a>
                  </>
                ) : (
                  <p className="text-gray-400">
                    {typeof dashboardData?.errors?.apod === 'string' && dashboardData.errors.apod
                      ? dashboardData.errors.apod
                      : 'Unable to load APOD data'}
                  </p>
                )}
              </div>
            )}
          </div>
        </motion.div>

        {/* Mars Rover Section */}
        <motion.div
          ref={marsRoverRef}
          initial={{ opacity: 0, y: 20 }}
          animate={marsRoverInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="space-card">
            <div className="flex items-center space-x-3 mb-6">
              <Globe className="w-6 h-6 text-mars-red" />
              <h2 className="text-2xl font-space font-bold text-gradient-stellar">
                Mars Rover Photos
              </h2>
            </div>
            
            {marsRoverData && marsRoverData.photos && marsRoverData.photos.length > 0 ? (
              <div className="flex flex-col lg:flex-row gap-8 items-stretch">
                {/* Photos Grid */}
                <div className="flex-1 lg:max-h-[600px] lg:overflow-y-auto">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {marsRoverData.photos.slice(0, 4).map((photo: MarsRoverPhoto) => (
                      <motion.div
                        key={photo.id}
                        whileHover={{ scale: 1.05 }}
                        className="bg-white/5 rounded-lg overflow-hidden flex flex-col shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <div className="relative">
                          <img
                            src={photo.img_src}
                            alt={photo.camera.full_name}
                            className="w-full h-48 object-cover"
                            onError={(e) => {
                              // Fallback to a placeholder if image fails to load
                              e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23374151'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%239CA3AF' font-family='Arial' font-size='16'%3EMars Rover Photo%3C/text%3E%3C/svg%3E";
                            }}
                          />
                        </div>
                        <div className="p-4 flex-1 flex flex-col justify-between">
                          <div>
                            <p className="text-sm text-gray-300 font-medium">
                              {photo.camera.full_name}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {photo.earth_date} (Sol {photo.sol})
                            </p>
                          </div>
                          <div className="mt-2 flex items-center space-x-2">
                            <div className="w-2 h-2 bg-mars-red rounded-full"></div>
                            <span className="text-xs text-gray-400">{photo.rover.name}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
                {/* Chart */}
                <div className="flex-1 flex flex-col justify-center items-center min-w-[250px]">
                  <h3 className="text-lg font-semibold text-white mb-4 text-center">Camera Distribution</h3>
                  <ResponsiveContainer width="100%" height={300} minWidth={250} minHeight={250}>
                    <PieChart>
                      <Pie
                        data={(() => {
                          const cameraCounts: { [key: string]: number } = {};
                          marsRoverData.photos.forEach((photo: MarsRoverPhoto) => {
                            cameraCounts[photo.camera.name] = (cameraCounts[photo.camera.name] || 0) + 1;
                          });
                          return Object.entries(cameraCounts).map(([camera, count]) => ({
                            name: camera.toUpperCase(),
                            value: count,
                            color: `hsl(${Math.random() * 360}, 70%, 50%)`
                          }));
                        })()}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#e91e63"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {(() => {
                          const cameraCounts: { [key: string]: number } = {};
                          marsRoverData.photos.forEach((photo: MarsRoverPhoto) => {
                            cameraCounts[photo.camera.name] = (cameraCounts[photo.camera.name] || 0) + 1;
                          });
                          return Object.entries(cameraCounts).map(([camera], index) => (
                            <Cell key={camera} fill={`hsl(${index * 60}, 70%, 50%)`} />
                          ));
                        })()}
                      </Pie>
                      <Tooltip 
                        formatter={(value, name) => [`${value} photos`, name]}
                        contentStyle={{ 
                          backgroundColor: '#1f2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px',
                          color: '#fff'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-400">Total Photos: {marsRoverData.photos.length}</p>
                    <p className="text-xs text-gray-500">Real data from NASA API</p>
                    <p className="text-xs text-gray-500">Rover: Curiosity</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <AlertTriangle className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                {typeof dashboardData?.errors?.marsRoverData === 'string' &&
                  /rate limit|429/i.test(dashboardData.errors.marsRoverData) ? (
                  <>
                    <p className="text-lg text-mars-red font-semibold mb-2">NASA API Rate Limit Exceeded</p>
                    <p className="text-gray-400 mb-2">You've made too many requests to the NASA API. Please try again in a few minutes.</p>
                    <a href="https://api.nasa.gov/contact/" target="_blank" rel="noopener noreferrer" className="underline text-cosmic-pink">Contact NASA API Support</a>
                  </>
                ) : (
                  <p className="text-gray-400">
                    {typeof dashboardData?.errors?.marsRoverData === 'string' && dashboardData.errors.marsRoverData
                      ? dashboardData.errors.marsRoverData
                      : 'Unable to load Mars rover photos'}
                  </p>
                )}
              </div>
            )}
          </div>
        </motion.div>

        {/* NEO Section */}
        <motion.div
          ref={neoRef}
          initial={{ opacity: 0, y: 20 }}
          animate={neoInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="space-card">
            <div className="flex items-center space-x-3 mb-6">
              <Rocket className="w-6 h-6 text-stellar-yellow" />
              <h2 className="text-2xl font-space font-bold text-gradient-stellar">
                Near Earth Objects
              </h2>
            </div>
            
            {dashboardData?.neoData ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-white/5 rounded-lg">
                    <div className="text-2xl font-bold text-stellar-yellow">
                      {dashboardData.neoData.element_count}
                    </div>
                    <div className="text-sm text-gray-400">Total Objects</div>
                  </div>
                  <div className="text-center p-4 bg-white/5 rounded-lg">
                    <div className="text-2xl font-bold text-mars-red">
                      {Object.values(dashboardData.neoData.near_earth_objects)
                        .flat()
                        .filter(obj => obj.is_potentially_hazardous_asteroid).length}
                    </div>
                    <div className="text-sm text-gray-400">Potentially Hazardous</div>
                  </div>
                  <div className="text-center p-4 bg-white/5 rounded-lg">
                    <div className="text-2xl font-bold text-earth-green">
                      {Object.keys(dashboardData.neoData.near_earth_objects).length}
                    </div>
                    <div className="text-sm text-gray-400">Days Tracked</div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-white">Recent Close Approaches</h3>
                  {Object.entries(dashboardData.neoData.near_earth_objects)
                    .slice(0, 5)
                    .map(([date, objects]) => (
                      <div key={date} className="bg-white/5 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-white font-medium">
                            {format(new Date(date), 'MMMM d, yyyy')}
                          </span>
                          <span className="text-sm text-gray-400">
                            {objects.length} objects
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                          {objects.slice(0, 3).map((obj) => (
                            <div
                              key={obj.id}
                              className={`text-xs p-2 rounded ${
                                obj.is_potentially_hazardous_asteroid
                                  ? 'bg-mars-red/20 text-mars-red'
                                  : 'bg-earth-green/20 text-earth-green'
                              }`}
                            >
                              {obj.name}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
                {dashboardData?.neoData?.near_earth_objects && (
                  <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Pie chart: hazardous vs non-hazardous */}
                    <div className="bg-white/5 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-white mb-2">Hazardous vs Non-Hazardous</h3>
                      <ResponsiveContainer width="100%" height={220}>
                        <PieChart>
                          <Pie
                            data={(() => {
                              let hazardous = 0, nonHazardous = 0;
                              Object.values(dashboardData.neoData.near_earth_objects).flat().forEach((neo: any) => {
                                if (neo.is_potentially_hazardous_asteroid) hazardous++;
                                else nonHazardous++;
                              });
                              return [
                                { name: 'Hazardous', value: hazardous },
                                { name: 'Non-Hazardous', value: nonHazardous }
                              ];
                            })()}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={70}
                            label
                          >
                            <Cell fill="#e91e63" />
                            <Cell fill="#00bcd4" />
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    {/* Bar chart: closest approach distances */}
                    <div className="bg-white/5 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-white mb-2">Closest Approaches (km)</h3>
                      <ResponsiveContainer width="100%" height={220}>
                        <BarChart
                          data={Object.values(dashboardData.neoData.near_earth_objects).flat().slice(0, 8).map((neo: any) => ({
                            name: neo.name,
                            distance: Number(neo.close_approach_data[0]?.miss_distance?.kilometers)
                          }))}
                        >
                          <XAxis dataKey="name" tick={{ fill: '#fff', fontSize: 10 }} interval={0} angle={-30} textAnchor="end" height={60} />
                          <YAxis tick={{ fill: '#fff' }} />
                          <Bar dataKey="distance" fill="#00bcd4" />
                          <Tooltip />
                          <Legend />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <AlertTriangle className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                {typeof dashboardData?.errors?.neoData === 'string' &&
                  /rate limit|429/i.test(dashboardData.errors.neoData) ? (
                  <>
                    <p className="text-lg text-mars-red font-semibold mb-2">NASA API Rate Limit Exceeded</p>
                    <p className="text-gray-400 mb-2">You've made too many requests to the NASA API. Please try again in a few minutes.</p>
                    <a href="https://api.nasa.gov/contact/" target="_blank" rel="noopener noreferrer" className="underline text-cosmic-pink">Contact NASA API Support</a>
                  </>
                ) : (
                  <p className="text-gray-400">
                    {typeof dashboardData?.errors?.neoData === 'string' && dashboardData.errors.neoData
                      ? dashboardData.errors.neoData
                      : 'Unable to load NEO data'}
                  </p>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Dashboard 