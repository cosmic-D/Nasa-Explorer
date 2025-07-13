import { motion } from 'framer-motion'
import { ExternalLink, Github, Twitter, Globe } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const socialLinks = [
    {
      name: 'NASA API',
      href: 'https://api.nasa.gov/',
      icon: Globe,
      description: 'Official NASA APIs'
    },
    {
      name: 'GitHub',
      href: 'https://github.com',
      icon: Github,
      description: 'Source Code'
    },
    {
      name: 'Twitter',
      href: 'https://twitter.com/NASA',
      icon: Twitter,
      description: 'NASA Updates'
    }
  ]

  return (
    <footer className="glass-effect mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
          {/* Project Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-r from-cosmic-pink to-nebula-cyan rounded flex items-center justify-center">
                <Globe className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-base sm:text-lg font-space font-bold text-gradient">
                NASA Space Explorer
              </h3>
            </div>
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
              Explore the wonders of space with NASA's vast collection of astronomical data, 
              images, and discoveries. Discover the cosmos through interactive visualizations.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-4"
          >
            <h4 className="text-white font-semibold text-base sm:text-lg">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a 
                  href="https://apod.nasa.gov/apod/astropix.html" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-cosmic-pink transition-colors flex items-center space-x-1"
                >
                  <span>Astronomy Picture of the Day</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a 
                  href="https://mars.nasa.gov/msl/home/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-mars-red transition-colors flex items-center space-x-1"
                >
                  <span>Mars Rover Mission</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a 
                  href="https://cneos.jpl.nasa.gov/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-stellar-yellow transition-colors flex items-center space-x-1"
                >
                  <span>Near Earth Objects</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4"
          >
            <h4 className="text-white font-semibold text-base sm:text-lg">Connect</h4>
            <div className="flex space-x-4">
              {socialLinks.map((link) => {
                const Icon = link.icon
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative"
                    title={link.description}
                  >
                    <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors">
                      <Icon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                    </div>
                  </a>
                )
              })}
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 pt-8 border-t border-white/10"
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <p className="text-gray-400 text-xs sm:text-sm">
              © {currentYear} NASA Space Explorer. Built with ❤️ for space exploration.
            </p>
            <p className="text-gray-400 text-xs sm:text-sm">
              Data provided by{' '}
              <a 
                href="https://api.nasa.gov/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-cosmic-pink hover:text-nebula-cyan transition-colors"
              >
                NASA Open APIs
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}

export default Footer 