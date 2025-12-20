  useEffect(() => {
    const handleResize = () => {
      const desktop = getIsDesktop();
      setIsDesktop(desktop);
      if (desktop) {
        setIsSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiHome, FiUsers, FiCalendar, FiDollarSign, FiStar, 
  FiEdit3, FiActivity, FiImage, FiMenu, FiX 
} from 'react-icons/fi';

const AdminNavigation = () => {
  const getIsDesktop = () => (typeof window !== 'undefined' ? window.innerWidth >= 1024 : false);

  const [isDesktop, setIsDesktop] = useState(getIsDesktop);
  const [isSidebarOpen, setIsSidebarOpen] = useState(getIsDesktop);
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: <FiHome />, exact: true },
    { name: 'Rooms', path: '/admin/rooms', icon: <FiHome /> },
    { name: 'Bookings', path: '/admin/bookings', icon: <FiCalendar /> },
    { name: 'Payments', path: '/admin/payments', icon: <FiDollarSign /> },
    { name: 'Users', path: '/admin/users', icon: <FiUsers /> },
    { name: 'Reviews', path: '/admin/reviews', icon: <FiStar /> },
    { name: 'Gallery', path: '/admin/gallery', icon: <FiImage /> },
    { name: 'Blog', path: '/admin/blog', icon: <FiEdit3 /> },
    { name: 'Activities', path: '/admin/activities', icon: <FiActivity /> },
  ];

  const isActive = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="bg-white shadow-lg rounded-lg p-3 text-gray-700 hover:text-primary-600"
        >
          {isSidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && !isDesktop && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{
          x: isSidebarOpen ? 0 : '-100%'
        }}
        transition={{ type: 'tween', duration: 0.3 }}
        className={`fixed left-0 top-0 h-full w-64 bg-white shadow-xl z-50 lg:translate-x-0 lg:static lg:shadow-none border-r border-gray-200`}
      >
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center text-white font-bold">
              A
            </div>
            <div>
              <h2 className="font-bold text-gray-900">Admin Panel</h2>
              <p className="text-sm text-gray-500">OKELLA RESORT</p>
            </div>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive(item.path, item.exact)
                    ? 'bg-primary-50 text-primary-600 border-r-2 border-primary-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Bottom section */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:text-primary-600 transition-colors"
          >
            <FiHome />
            <span>Back to Website</span>
          </Link>
        </div>
      </motion.div>
    </>
  );
};

export default AdminNavigation;
