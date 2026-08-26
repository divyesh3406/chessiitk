import React, { useState, useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import { AuthProvider } from './context/AuthContext';
import ScrollToTop from './components/ScrollToTop';
import ErrorBoundary from './components/ErrorBoundary';
import PageTransition from './components/PageTransition';

import ServerError500 from './pages/ServerError500';
import { API_BASE_URL } from './config';
import { globalCache } from './utils/cache';
import AdminRoute from './components/AdminRoute';

// Import critical images for preloading
import chessboardImg from './assets/chessclubiitklogo.jpeg';
import homePgBg from './pages/home-pg-bg.png';
import logoImg from './assets/chessclubiitklogo.jpeg';

// Lazy loaded page components for optimal production bundle code-splitting
const Landing = React.lazy(() => import('./pages/Landing'));
const Calendar = React.lazy(() => import('./pages/Calendar'));
const Events = React.lazy(() => import('./pages/Events'));
const EventRegistration = React.lazy(() => import('./pages/EventRegistration'));
const Blogs = React.lazy(() => import('./pages/Blogs'));
const BlogPost = React.lazy(() => import('./pages/BlogPost'));
const UserProfile = React.lazy(() => import('./pages/UserProfile'));
const Contact = React.lazy(() => import('./pages/Contact'));
const PreviousTeams = React.lazy(() => import('./pages/PreviousTeams'));
const Gallery = React.lazy(() => import('./pages/Gallery'));
const Signup = React.lazy(() => import('./pages/Signup'));
const Login = React.lazy(() => import('./pages/Login'));
const ForgotPassword = React.lazy(() => import('./pages/ForgotPassword'));
const Results = React.lazy(() => import('./pages/Results'));
const AdminPortal = React.lazy(() => import('./pages/AdminPortal'));

// Premium, brand-aligned loading spinner fallback
const PageLoader = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center bg-zinc-950 text-primary">
    <div className="w-10 h-10 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
  </div>
);

// Global App Preloader page loaded during database wake-up (cold-start protection)
const GlobalPreloader = () => (
  <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-zinc-950 text-white font-sans">
    <style>{`
      @keyframes loaderSlide {
        0% { transform: translateX(-100%); }
        50% { transform: translateX(100%); }
        100% { transform: translateX(-100%); }
      }
      .animate-loaderSlide {
        animation: loaderSlide 2s infinite ease-in-out;
      }
    `}</style>
    <div className="flex flex-col items-center max-w-sm px-6 text-center space-y-6">
      <div className="relative w-24 h-24 rounded-2xl overflow-hidden border border-[#d4af37]/20 shadow-[0_10px_30px_rgba(0,0,0,0.5)] animate-pulse">
        <img src={logoImg} alt="Chess Club Logo" className="w-full h-full object-cover animate-none" />
      </div>
      <div className="space-y-1">
        <h1 className="text-3xl font-serif tracking-tight text-white">Chess Club</h1>
        <p className="text-[10px] uppercase tracking-[0.25em] text-[#d4af37] font-semibold">IIT Kanpur</p>
      </div>
      <div className="w-40 h-[2px] bg-zinc-800 rounded-full overflow-hidden relative">
        <div className="absolute top-0 left-0 h-full w-24 bg-gradient-to-r from-[#d4af37] to-[#f2ca50] rounded-full animate-loaderSlide" />
      </div>
      <p className="text-[10px] text-zinc-500 uppercase tracking-widest animate-pulse">
        Setting up the board...
      </p>
    </div>
  </div>
);

// Background cache downloading function
const preloadCache = () => {
  try {
    fetch(`${API_BASE_URL}/api/blogs`)
      .then(res => res.ok ? res.json() : null)
      .then(data => { if (data) globalCache.blogs = data; })
      .catch(() => {});

    fetch(`${API_BASE_URL}/api/events`)
      .then(res => res.ok ? res.json() : null)
      .then(data => { if (data) globalCache.events = data; })
      .catch(() => {});

    fetch(`${API_BASE_URL}/api/gallery`)
      .then(res => res.ok ? res.json() : null)
      .then(data => { if (data) globalCache.gallery = data; })
      .catch(() => {});
  } catch (e) {
    // Ignore background load failures
  }
};

function App() {
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    // 1. Database Connection check promise
    const dbPromise = fetch(`${API_BASE_URL}/db-test`)
      .then(res => res.ok ? res.json() : null)
      .catch(() => null);

    // 2. Image preloading promise
    const preloadImage = (src) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = src;
        img.onload = resolve;
        img.onerror = resolve; // Continue even if an image fails to load
      });
    };

    const imagesPromise = Promise.all([
      preloadImage(chessboardImg),
      preloadImage(homePgBg),
      preloadImage(logoImg)
    ]);

    // 3. Wait for database + images
    Promise.all([dbPromise, imagesPromise]).then(() => {
      setIsAppReady(true);
      // Start caching dynamic content in the background after the page renders
      setTimeout(preloadCache, 500);
    });
  }, []);

  if (!isAppReady) {
    return <GlobalPreloader />;
  }

  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <MainLayout>
          <ErrorBoundary>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<PageTransition><Landing /></PageTransition>} />
                <Route path="/calendar" element={<PageTransition><Calendar /></PageTransition>} />
                <Route path="/events" element={<PageTransition><Events /></PageTransition>} />
                <Route path="/events/results/:id" element={<PageTransition><Results /></PageTransition>} />
                <Route path="/events/register/:id" element={<PageTransition><EventRegistration /></PageTransition>} />
                <Route path="/blogs" element={<PageTransition><Blogs /></PageTransition>} />
                <Route path="/blog/:id" element={<PageTransition><BlogPost /></PageTransition>} />
                <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
                <Route path="/previous-teams" element={<PageTransition><PreviousTeams /></PageTransition>} />
                <Route path="/gallery" element={<PageTransition><Gallery /></PageTransition>} />
                <Route path="/user" element={<PageTransition><UserProfile /></PageTransition>} />
                <Route path="/signup" element={<PageTransition><Signup /></PageTransition>} />
                <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
                <Route path="/forgot-password" element={<PageTransition><ForgotPassword /></PageTransition>} />
                <Route path="/admin" element={<AdminRoute><PageTransition><AdminPortal /></PageTransition></AdminRoute>} />
                <Route path="/500" element={<PageTransition><ServerError500 /></PageTransition>} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </MainLayout>
      </Router>
    </AuthProvider>
  );
}

export default App;
