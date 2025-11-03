import { Link } from 'react-router-dom'
import { FiFacebook, FiTwitter, FiInstagram, FiMail, FiPhone, FiMapPin } from 'react-icons/fi'
import Logo from './common/Logo'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <Logo size="default" variant="full" className="text-primary-400 mb-4" />
            <p className="text-gray-400 mb-4">
              Experience the mystique of OKELLA RESORT - where the spirit of the scorpion meets 
              luxury. Unforgettable coastal paradise with world-class amenities awaits.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <FiFacebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <FiTwitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <FiInstagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold font-poppins mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/rooms" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Rooms & Suites
                </Link>
              </li>
              <li>
                <Link to="/activities" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Activities
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-primary-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold font-poppins mb-4">Services</h4>
            <ul className="space-y-2 text-gray-400">
              <li>🏊 Swimming Pool</li>
              <li>🍽️ Fine Dining</li>
              <li>💆 Spa & Wellness</li>
              <li>🏄 Water Sports</li>
              <li>🚗 Airport Transfer</li>
              <li>📶 Free Wi-Fi</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold font-poppins mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <FiMapPin className="text-primary-400 mt-1" size={18} />
                <span className="text-gray-400">
                  Next to Bondo Technical Training Institute<br />
                  Bondo-Misori Road, Bondo, Siaya County, Kenya
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <FiPhone className="text-primary-400" size={18} />
                <a href="tel:+254700000000" className="text-gray-400 hover:text-primary-400">
                  +254 700 000 000
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <FiMail className="text-primary-400" size={18} />
                <a href="mailto:info@okellaresort.com" className="text-gray-400 hover:text-primary-400">
                  info@okellaresort.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {currentYear} OKELLA RESORT. All rights reserved.</p>
          <div className="flex justify-center space-x-6 mt-4 text-sm">
            <Link to="/privacy" className="hover:text-primary-400 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-primary-400 transition-colors">
              Terms of Service
            </Link>
            <Link to="/cookie-policy" className="hover:text-primary-400 transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
