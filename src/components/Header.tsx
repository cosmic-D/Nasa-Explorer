import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Menu, X, Rocket, Globe, Camera, Search, Home } from 'lucide-react'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()

  const navigation = [
    { name: 'Dashboard', abbr: 'Dash', href: '/', icon: Home },
    { name: 'APOD', abbr: 'APOD', href: '/apod', icon: Camera },
    { name: 'Mars Rover', abbr: 'MR', href: '/mars-rover', icon: Globe },
    { name: 'Near Earth Objects', abbr: 'NEO', href: '/neo', icon: Rocket },
    { name: 'EPIC', abbr: 'EPIC', href: '/epic', icon: Camera },
    { name: 'Image Search', abbr: 'IMG', href: '/search', icon: Search },
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <header className="glass-effect sticky top-0 z-50 shadow-lg border-b border-white/10 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-20 min-w-0 gap-2 sm:gap-4 md:gap-8 overflow-x-hidden">
          {/* Logo and Title */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 min-w-0"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-cosmic-pink to-nebula-cyan rounded-lg flex items-center justify-center shadow flex-shrink-0">
              <Rocket className="w-6 h-6 text-white" />
            </div>
            <Link to="/" className="text-base sm:text-lg md:text-2xl font-space font-bold text-gradient break-words min-w-0 max-w-full">
              NASA Space Explorer
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-2 md:space-x-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                title={item.name}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 border-2 ${
                  isActive(item.href)
                    ? 'text-white bg-cosmic-pink border-cosmic-pink shadow-md'
                    : 'text-gray-300 border-transparent hover:text-cosmic-pink hover:border-cosmic-pink hover:bg-white/5'
                }`}
              >
                <item.icon className="w-6 h-6 min-w-[1.5rem] flex-shrink-0" />
                <span>{item.abbr}</span>
              </Link>
            ))}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="sm:hidden py-4 border-t border-white/10"
          >
            <div className="flex flex-col space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  title={item.name}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive(item.href)
                      ? 'text-cosmic-pink bg-white/10'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <item.icon className="w-6 h-6 min-w-[1.5rem] flex-shrink-0" />
                  <span>{item.abbr}</span>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </header>
  )
}

export default Header 