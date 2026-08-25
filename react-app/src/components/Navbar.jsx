import { useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { createPortal } from 'react-dom';
import logo from '../assets/chessclubiitklogo.jpeg';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { isLoggedIn, logout, user } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleAuthClick = () => {
    if (isLoggedIn) {
      setShowLogoutModal(true);
    } else {
      navigate('/login');
    }
  };

  const confirmLogout = () => {
    logout();
    setShowLogoutModal(false);
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Calendar', path: '/calendar' },
    { name: 'Events', path: '/events' },
    { name: 'Blogs', path: '/blogs' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Contact Us', path: '/contact' },
    { name: 'Previous Teams', path: '/previous-teams' },
  ];

  if (isLoggedIn && user?.is_admin) {
    navLinks.push({ name: 'Admin', path: '/admin' });
  }

  const location = useLocation();
  const isHomepage = location.pathname === '/';

  return (
    <motion.nav
      initial={{ opacity: 0, y: -18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="sticky top-0 z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant/15 px-4 md:px-8 py-4 flex items-center justify-between"
    >
      {/* Left: Logo */}
      <motion.div
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.75, delay: 0.18, ease: "easeOut" }}
      >
        <Link to="/" className="flex items-center gap-3 sm:gap-4 group">
          <img
            alt="Chess Club Seal"
            className="w-10 h-10 rounded-full border border-primary-container/20 group-hover:border-primary transition-all duration-300 shadow-md object-cover"
            src={logo}
          />
          <div className="flex flex-col">
            <span className="text-lg sm:text-xl font-headline text-primary leading-none">
              Chess Club
            </span>
            <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-on-surface-variant/60 font-bold">IIT Kanpur</span>
          </div>
        </Link>
      </motion.div>

      {/* Center: Navigation Links */}
      <div className="hidden md:flex items-center gap-10">
        {navLinks.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) =>
              `text-xs font-label uppercase tracking-[0.2em] transition-all duration-300 ${isActive
                ? 'text-primary font-bold border-b-2 border-primary pb-1'
                : 'text-on-surface-variant/70 hover:text-primary font-medium px-1'
              }`
            }
          >
            {link.name}
          </NavLink>
        ))}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-4 sm:gap-6">
        <button
          onClick={handleAuthClick}
          className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-4 py-2 sm:px-5 sm:py-2.5 rounded-full transition-all duration-300 ${isLoggedIn
            ? 'bg-surface-container border border-outline-variant/30 hover:bg-error/10 hover:text-error hover:border-error/30'
            : 'bg-primary text-on-primary hover:scale-105 shadow-lg shadow-primary/10'
            }`}
        >
          <span className="material-symbols-outlined text-[18px]">
            {isLoggedIn ? 'logout' : 'login'}
          </span>
          <span className="hidden sm:inline">{isLoggedIn ? 'Log Out' : 'Login'}</span>
        </button>

        {isLoggedIn && (
          <Link to="/user" className="flex items-center justify-center w-9 h-9 rounded-full bg-surface-container border border-outline-variant/30 hover:border-primary transition-all">
            <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
          </Link>
        )}

        {/* Mobile Hamburger Menu Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex md:hidden items-center justify-center w-9 h-9 rounded-full bg-surface-container border border-outline-variant/30 hover:border-primary text-on-surface-variant hover:text-primary transition-all focus:outline-none"
        >
          <span className="material-symbols-outlined text-[20px]">
            {isOpen ? 'close' : 'menu'}
          </span>
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute top-full left-0 w-full bg-surface/95 backdrop-blur-lg border-b border-outline-variant/15 flex flex-col px-8 py-6 gap-4 md:hidden z-40"
          >
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `text-sm font-label uppercase tracking-[0.2em] py-2 transition-all duration-300 ${isActive
                    ? 'text-primary font-bold pl-2 border-l-2 border-primary'
                    : 'text-on-surface-variant/70 hover:text-primary font-medium px-2'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Logout Confirmation Modal */}
      {createPortal(
        <AnimatePresence>
          {showLogoutModal && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="bg-surface-container-low p-6 sm:p-8 rounded-3xl border border-outline-variant/15 shadow-2xl max-w-sm w-full mx-4 text-center space-y-6 relative"
              >
                <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-red-500/10 border border-red-500/20 text-red-500">
                  <span className="material-symbols-outlined text-2xl">logout</span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-serif font-bold text-on-surface">Confirm Log Out</h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed">Are you sure you want to end your active session?</p>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowLogoutModal(false)}
                    className="flex-1 py-3 px-4 border border-outline-variant/20 hover:border-outline-variant text-on-surface-variant hover:text-on-surface text-xs font-bold font-label uppercase tracking-widest rounded-xl transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={confirmLogout}
                    className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 text-white text-xs font-bold font-label uppercase tracking-widest rounded-xl shadow-lg hover:shadow-red-500/20 transition-all cursor-pointer"
                  >
                    Log Out
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </motion.nav>
  );
};

export default Navbar;
