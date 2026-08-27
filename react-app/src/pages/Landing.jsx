import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Lenis from 'lenis';
import fresherImg from '../assets/fresher_league_recap_1775765383248.png';
import grandSwissImg from '../assets/grand_swiss_recap_1775765397656.png';
import fideImg from '../assets/fide.png';
import logoImg from '../assets/chessclubiitklogo.jpeg';
import lolImg from "../assets/lol_poster.png";
import { useAuth } from '../context/AuthContext';
import { motion, useScroll, useTransform } from 'framer-motion';
import Footer from '../components/Footer';
import tanmayImg from "../assets/exCoordinators/tanmay.jpg";
import akshatImg from "../assets/exCoordinators/akshat.png";
import kushagraImg from "../assets/exCoordinators/kushagra.jpg";
import pulkitImg from "../assets/exCoordinators/pulkit.jpg";
import { API_BASE_URL } from '../config';
import { globalCache } from '../utils/cache';
import FloatingChessPieces from '../components/FloatingChessPieces';

const AnimatedCounter = ({ value, duration = 1200, trigger }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!trigger) {
      setCount(0);
      return;
    }

    const match = value.match(/^(.*?)([0-9,.]+)(.*?)$/);
    if (!match) {
      setCount(value);
      return;
    }

    const targetNum = parseFloat(match[2].replace(/,/g, ''));
    let start = 0;
    const end = targetNum;
    if (start === end) return;

    let startTimestamp = null;
    let animFrame = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Calculate current count using quadratic ease-out for a nicer rapid-scrolling effect
      const easeOutQuad = 1 - (1 - progress) * (1 - progress);
      const currentVal = Math.floor(easeOutQuad * (end - start) + start);
      setCount(currentVal);

      if (progress < 1) {
        animFrame = window.requestAnimationFrame(step);
      } else {
        setCount(end);
      }
    };

    animFrame = window.requestAnimationFrame(step);
    return () => {
      if (animFrame) window.cancelAnimationFrame(animFrame);
    };
  }, [value, duration, trigger]);

  const match = value.match(/^(.*?)([0-9,.]+)(.*?)$/);
  if (!match) return <span>{value}</span>;
  const prefix = match[1];
  const suffix = match[3];
  return <span>{prefix}{count.toLocaleString()}{suffix}</span>;
};

const Landing = () => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [nextEvent, setNextEvent] = useState(null);
  const [triggerStats, setTriggerStats] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const containerRef = useRef(null);
  const isLockedRef = useRef(false);

  // Synchronize activeSection change with stats counters with a delay on scroll-away
  useEffect(() => {
    if (activeSection === 2) {
      setTriggerStats(true);
    } else {
      // Wait 1000ms for the slide transition to complete before resetting counters to 0
      const timer = setTimeout(() => {
        setTriggerStats(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [activeSection]);

  // Section scroll execution controller
  const scrollToSection = (direction) => {
    setActiveSection((current) => {
      const nextIndex = current + direction;
      if (nextIndex < 0 || nextIndex > 4) return current;

      isLockedRef.current = true;

      const container = containerRef.current;
      if (container) {
        const sectionHeight = container.clientHeight;
        let scrollTarget = nextIndex * sectionHeight;
        if (nextIndex === 4) {
          // Snap footer fully at the bottom of the container
          scrollTarget = container.scrollHeight - sectionHeight;
        }

        container.scrollTo({
          top: scrollTarget,
          behavior: 'smooth'
        });
      }

      // Lock cooldown matches the transition speed (800ms) to allow responsive successive scrolls
      setTimeout(() => {
        isLockedRef.current = false;
      }, 800); 

      return nextIndex;
    });
  };

  // Wheel Event Handler (Desktop/Mouse/Trackpad) with inertial momentum filtering
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e) => {
      if (window.innerWidth < 768) return; // Allow natural scrolling on mobile
      e.preventDefault(); // Lock native browser scroll response

      if (isLockedRef.current) return;

      const delta = e.deltaY;
      const absDelta = Math.abs(delta);

      // Only trigger if scroll velocity is high enough (filters out inertial momentum decay)
      if (absDelta > 35) {
        const direction = delta > 0 ? 1 : -1;
        scrollToSection(direction);
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [activeSection]);

  // Touch Event Handler (Mobile/Tablet Swipes)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let touchStartY = 0;

    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
      if (window.innerWidth < 768) return; // Allow natural touch swiping on mobile
      // Prevent default elastic scroll bounces
      e.preventDefault();
    };

    const handleTouchEnd = (e) => {
      if (window.innerWidth < 768) return; // Allow natural touch swiping on mobile
      if (isLockedRef.current) return;

      const touchEndY = e.changedTouches[0].clientY;
      const diff = touchStartY - touchEndY;

      if (Math.abs(diff) > 40) { // Swipe sensitivity threshold
        const direction = diff > 0 ? 1 : -1;
        scrollToSection(direction);
      }
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [activeSection]);

  useEffect(() => {
    document.title = "Chess Club IITK";
    return () => {
      document.title = "Chess Club IITK";
    };
  }, []);

  useEffect(() => {
    // Delay preloading by 2 seconds to prioritize main landing page resources
    const timer = setTimeout(() => {
      const imagesToPreload = [tanmayImg, akshatImg, kushagraImg, pulkitImg];
      imagesToPreload.forEach(src => {
        const img = new Image();
        img.src = src;
      });
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchNextEvent = async () => {
      let data = globalCache.events;
      if (!data) {
        try {
          const res = await fetch(`${API_BASE_URL}/api/events`);
          if (res.ok) {
            data = await res.json();
            globalCache.events = data;
          }
        } catch (e) {}
      }
      if (data && Array.isArray(data)) {
        const today = new Date();
        today.setHours(0,0,0,0);
        
        // format and filter
        const upcoming = data.map(evt => ({
          id: evt.id,
          title: evt.title,
          date: evt.event_date,
          endDate: evt.event_end_date,
          tag: evt.event_type,
          shortDesc: evt.short_description,
          location: evt.location,
          format: evt.format
        })).filter(evt => {
          const dateStr = evt.endDate && evt.endDate !== 'null' && evt.endDate !== 'None' ? evt.endDate : evt.date;
          if (!dateStr) return false;
          const compareDate = new Date(dateStr);
          if (isNaN(compareDate.getTime())) return false;
          compareDate.setHours(0,0,0,0);
          return compareDate >= today;
        });
        
        if (upcoming.length > 0) {
          // Sort by date ascending
          upcoming.sort((a, b) => new Date(a.date) - new Date(b.date));
          setNextEvent(upcoming[0]);
        }
      }
    };
    fetchNextEvent();
  }, []);

  // Helper to map event to image
  const getEventImage = (event) => {
    return logoImg;
  };

  return (
    <div ref={containerRef} className="scroll-snap-container bg-[#121212] relative">
      {/* SVG Filters for Dot Matrix and Tints */}
      <svg className="absolute w-0 h-0 pointer-events-none opacity-0" aria-hidden="true">
        <defs>
          <filter id="dot-matrix-beige">
            <feColorMatrix 
              type="matrix" 
              values="
                0.88 0 0 0 0.08
                0 0.84 0 0 0.08
                0 0 0.76 0 0.08
                0 0 0 1 0" 
            />
          </filter>
          <filter id="dot-matrix-green">
            <feColorMatrix 
              type="matrix" 
              values="
                0.13 0 0 0 0.02
                0 0.55 0 0 0.05
                0 0 0.13 0 0.02
                0 0 0 1 0" 
            />
          </filter>
        </defs>
      </svg>

      {/* Global Background Grid and Floating Chess Pieces (Fixed behind all sections) */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Subtle Aesthetic Cross Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.14]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1.2px, transparent 0)`,
            backgroundSize: '44px 44px'
          }}
        />

        {/* Dynamic Floating Chess Pieces */}
        <FloatingChessPieces />

        {/* Vignette & Soft Center Glow */}
        <div className="absolute inset-0 bg-radial from-transparent via-[#121212]/50 to-[#121212]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] rounded-full bg-primary/5 blur-[140px]" />
      </div>

      {/* SECTION 1: HERO (Center Title) */}
      <section className="scroll-snap-section relative z-10">
        <div className="flex flex-col items-center justify-center px-4 max-w-4xl mx-auto text-center select-none">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-sans font-black tracking-tight uppercase leading-[0.95] text-[#e5e2e1] drop-shadow-[0_15px_35px_rgba(0,0,0,0.95)]"
          >
            CHESS CLUB
            <span className="block text-primary mt-3 sm:mt-4 font-sans font-black tracking-normal text-3xl sm:text-5xl md:text-6xl lg:text-7xl drop-shadow-[0_10px_25px_rgba(242,202,80,0.3)]">
              IITK
            </span>
          </motion.h1>

          {/* Scroll Indicator */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="mt-10 flex flex-col items-center gap-2"
          >
            <span className="text-[10px] uppercase font-mono tracking-[0.3em] text-on-surface-variant/70">
              Scroll to Explore
            </span>
            <span className="material-symbols-outlined text-sm text-primary animate-bounce">
              keyboard_arrow_down
            </span>
          </motion.div>
        </div>
      </section>

      {/* SECTION 2: ABOUT CHESS CLUB */}
      <section className="scroll-snap-section relative z-10 bg-transparent">
        <div className="w-full max-w-6xl mx-auto px-6 md:px-12 flex flex-col items-center justify-center py-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full flex flex-col items-center justify-center"
          >
            <div className="text-center mb-6 max-w-3xl mx-auto">
              <span className="text-primary font-label text-xs tracking-[0.3em] uppercase block mb-1">Who We Are</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-on-surface">About Chess Club</h2>
              <p className="mt-4 text-zinc-400 text-xs sm:text-sm md:text-base max-w-2xl mx-auto leading-relaxed font-body">
                Welcome to the Chess Club IIT Kanpur. Our mission is to foster intellectual growth, strategic thinking, and camaraderie through the timeless game of chess. We invite you to explore our upcoming schedules, participate in our organised events.
              </p>
              <p className="mt-3 text-primary font-bold text-xs sm:text-sm md:text-base tracking-[0.2em] uppercase font-label">
                Discover your next move.
              </p>
            </div>

            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 pt-2">
              {[
                { 
                  id: 1, 
                  title: "Play and Grow", 
                  desc: "Our club provides a welcoming environment where players of all experience levels can engage in regular over-the-board play, participate in casual match analysis, and benefit from peer-led mentorship." 
                },
                { 
                  id: 2, 
                  title: "Competitive Environment", 
                  desc: "The club hosts regular online and over-the-board campus tournaments open to all skill levels. We invite everyone to join this competitive environment, designed to foster creative tactical thinking, sharpen strategic skills, and help players flourish." 
                },
                { 
                  id: 3, 
                  title: "Exclusive Events & Talk Shows", 
                  desc: "We feature exclusive talk shows and masterclasses with renowned global chess personalities, including World Champion GM Gukesh Dommaraju, GM Arjun Erigaisi, ChessBase India's Sagar Shah, and Chess.com CEO Erik Allebest." 
                }
              ].map((card) => (
                <div key={card.id} className="relative group cursor-pointer h-full">
                  <div className="relative z-10 rounded-2xl border border-outline-variant/15 bg-gradient-to-br from-surface-container-high/60 to-surface-container/20 backdrop-blur-md p-6 h-full min-h-[200px] md:min-h-[240px] flex flex-col justify-between overflow-hidden hover:scale-[1.02] hover:border-primary/40 hover:shadow-[0_12px_36px_rgba(242,202,80,0.12)] transition-all duration-500">
                    <div className="absolute inset-0 bg-[#f2ca50] scale-x-0 group-hover:scale-x-100 transition-transform origin-right group-hover:origin-left duration-500 ease-in-out z-0 pointer-events-none"></div>
                    <div className="absolute -top-12 -right-12 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors duration-500 pointer-events-none z-10"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none z-10"></div>
                    <div className="relative z-20 flex flex-col h-full flex-1">
                      <div className="w-full flex flex-col items-center">
                        <div className="min-h-[50px] flex items-center justify-center w-full">
                          <h3 className="text-lg sm:text-xl font-serif text-on-surface group-hover:text-[#131313] transition-colors duration-500 leading-snug text-center w-full">
                            {card.title}
                          </h3>
                        </div>
                        <div className="w-12 h-[1.5px] bg-[#d4af37]/30 group-hover:bg-[#3c2f00]/40 mt-2 transition-colors duration-500"></div>
                      </div>
                      {card.desc && (
                        <p className="mt-4 text-xs text-on-surface-variant group-hover:text-[#251a00]/80 transition-colors duration-500 leading-relaxed text-center font-body">
                          {card.desc}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 3: DEDICATED CLUB STATS */}
      <section className="scroll-snap-section relative z-10 bg-transparent">
        <div className="w-full max-w-6xl mx-auto px-6 md:px-12 flex flex-col items-center justify-center py-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            onViewportEnter={() => setTriggerStats(true)}
            onViewportLeave={() => setTriggerStats(false)}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full flex flex-col items-center justify-center"
          >
            <div className="text-center mb-8 max-w-2xl mx-auto">
              <span className="text-primary font-label text-xs tracking-[0.3em] uppercase">Impact & Heritage</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-on-surface mt-1">Our Impact</h2>
              <p className="mt-3 text-zinc-400 text-xs sm:text-sm leading-relaxed font-body">
                Fostering high-stakes competitive chess and empowering strategic thinkers across IIT Kanpur.
              </p>
            </div>

            <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
              {[
                {
                  icon: "groups",
                  value: "800+",
                  label: "Community",
                  desc: "Students, contenders, and enthusiasts."
                },
                {
                  icon: "emoji_events",
                  value: "₹15L+",
                  label: "Prize Pool Awarded",
                  desc: "Cash prizes and trophies distributed across official championships."
                },
                {
                  icon: "history_edu",
                  value: "18+",
                  label: "Years of Legacy",
                  desc: "Archiving strategic brilliance and competitive spirit since 2007."
                },
                {
                  icon: "event_available",
                  value: "200+",
                  label: "Events Conducted",
                  desc: "FIDE Opens, CMPL, Blitz Arenas, and international guest talk shows."
                }
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className="relative group rounded-3xl border border-outline-variant/15 bg-gradient-to-br from-surface-container-high/70 to-surface-container/30 backdrop-blur-xl p-6 sm:p-7 flex flex-col justify-between overflow-hidden hover:border-primary/40 hover:scale-[1.03] hover:shadow-[0_15px_40px_rgba(242,202,80,0.15)] transition-all duration-500 cursor-pointer shadow-xl shadow-black/40 h-full"
                >
                  <div className="absolute inset-0 bg-[#f2ca50] scale-y-0 group-hover:scale-y-100 transition-transform origin-bottom duration-500 ease-in-out z-0 pointer-events-none opacity-90"></div>
                  <div className="absolute -top-10 -right-10 w-20 h-20 bg-primary/10 rounded-full blur-xl group-hover:bg-primary/20 transition-colors pointer-events-none z-10"></div>
                  
                  <div className="relative z-20 flex flex-col h-full justify-between">
                    <div>
                      <div className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#f2ca50] group-hover:text-[#131313] tracking-tight leading-none transition-colors duration-500 mb-2 mt-2">
                        <AnimatedCounter value={stat.value} trigger={triggerStats} />
                      </div>

                      <h3 className="text-sm sm:text-base font-serif font-bold text-on-surface group-hover:text-[#131313] uppercase tracking-wider transition-colors duration-500 mb-2">
                        {stat.label}
                      </h3>
                    </div>

                    <p className="text-xs text-zinc-400 group-hover:text-[#251a00]/80 leading-relaxed transition-colors duration-500 font-body mt-2">
                      {stat.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 4: UPCOMING EVENT */}
      <section className="scroll-snap-section relative z-10 bg-transparent">
        <div className="w-full max-w-5xl mx-auto px-6 md:px-12 flex flex-col items-center justify-center py-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full"
          >
            <div className="text-center mb-6">
              <span className="text-primary font-label text-xs tracking-[0.3em] uppercase">Featured Arena</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-on-surface mt-1">Upcoming Event</h2>
            </div>

            {nextEvent ? (
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('open-event-details-modal'))}
                className="w-full text-left rounded-3xl border border-[#4d4635]/30 bg-gradient-to-br from-surface-container-high/90 to-surface-container/60 backdrop-blur-xl hover:border-primary/50 hover:shadow-[0_0_50px_rgba(242,202,80,0.2)] transition-all duration-700 flex flex-col md:flex-row overflow-hidden group cursor-pointer relative shadow-2xl shadow-black/80"
              >
                {/* Smooth Golden Hover Fill Overlay */}
                <div className="absolute inset-0 bg-[#f2ca50] opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-in-out z-0 pointer-events-none"></div>

                {/* Event Image Container */}
                <div className="w-full md:w-[45%] relative aspect-[16/10] md:aspect-auto md:min-h-[260px] shrink-0 overflow-hidden z-10">
                  <img
                    alt={nextEvent.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    src={getEventImage(nextEvent)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-surface/70 via-transparent to-transparent"></div>
                  <div className="absolute inset-0 bg-[#d4af37]/5 mix-blend-overlay"></div>

                  {nextEvent.tag && (
                    <span className="absolute top-4 left-4 px-3 py-1 text-[9px] font-bold uppercase tracking-widest bg-surface/90 text-primary border border-primary/30 rounded-full backdrop-blur-sm shadow-md">
                      {nextEvent.tag}
                    </span>
                  )}
                </div>

                {/* Event Details */}
                <div className="p-6 sm:p-8 flex flex-col justify-between flex-1 min-w-0 relative z-10">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-mono font-bold uppercase tracking-[0.2em] text-[#d4af37]/70 group-hover:text-[#3c2f00]/70 transition-colors duration-700">
                        Spotlight Event
                      </span>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-primary group-hover:text-[#3c2f00] transition-colors duration-700">
                        <span>View details</span>
                        <span className="material-symbols-outlined text-[15px] group-hover:translate-x-1.5 transition-all duration-300">
                          arrow_forward
                        </span>
                      </div>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-serif text-on-surface font-semibold tracking-tight leading-tight group-hover:text-[#251a00] transition-colors duration-700">
                      {nextEvent.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-on-surface-variant/80 group-hover:text-[#251a00]/90 transition-colors duration-700 line-clamp-3 leading-relaxed font-body">
                      {nextEvent.shortDesc}
                    </p>
                  </div>

                  <div className="mt-6 pt-5 border-t border-outline-variant/15 group-hover:border-[#3c2f00]/25 transition-colors duration-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-on-surface-variant/90 group-hover:text-[#3c2f00]/90">
                    <div className="flex flex-col gap-2 min-w-0">
                      <div className="flex items-center gap-2.5">
                        <span className="material-symbols-outlined text-[16px] text-primary group-hover:text-[#3c2f00] transition-colors duration-700 shrink-0">calendar_today</span>
                        <span className="font-medium tracking-wide">{nextEvent.date}</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <span className="material-symbols-outlined text-[16px] text-primary group-hover:text-[#3c2f00] transition-colors duration-700 shrink-0">location_on</span>
                        <span className="font-medium tracking-wide truncate max-w-[240px]">{nextEvent.location}</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <span className="material-symbols-outlined text-[16px] text-primary group-hover:text-[#3c2f00] transition-colors duration-700 shrink-0">sports_esports</span>
                        <span className="font-medium tracking-wide truncate max-w-[280px]">{nextEvent.format || "Tournament System"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            ) : (
              <div className="w-full text-center p-12 rounded-3xl border border-[#4d4635]/20 bg-gradient-to-br from-surface-container-high/60 to-surface-container/30 backdrop-blur-xl flex flex-col items-center justify-center relative shadow-xl">
                <span className="material-symbols-outlined text-5xl text-primary/40 mb-4">sports_esports</span>
                <h3 className="text-xl font-serif text-on-surface font-semibold">Stay Tuned!</h3>
                <p className="text-xs sm:text-sm text-on-surface-variant/75 mt-2 max-w-md mx-auto font-body leading-relaxed">
                  We are currently preparing our next offline auctions and competitive arenas. Check back shortly or view our calendar for the full schedule!
                </p>
              </div>
            )}

            {/* Other Events CTA Button */}
            <div className="flex justify-center mt-6">
              <Link
                to="/events"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl border border-primary/30 bg-primary/10 text-xs font-bold uppercase tracking-widest text-primary hover:bg-primary hover:text-surface transition-all duration-300 shadow-lg shadow-primary/10"
              >
                <span className="material-symbols-outlined text-sm">event_note</span>
                View All Tournaments
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 5: FOOTER (Fits dynamically at the bottom) */}
      <div className="scroll-snap-footer">
        <Footer />
      </div>
    </div>
  );
};
export default Landing;
