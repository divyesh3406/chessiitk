import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { globalCache } from '../utils/cache';
import Navbar from '../components/Navbar';
import ScrollToTopButton from '../components/ScrollToTopButton';
import { API_BASE_URL } from '../config';

const MainLayout = ({ children }) => {
  const { isLoggedIn, token } = useAuth();
  const [isBannerVisible, setIsBannerVisible] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRegisteredForLol, setIsRegisteredForLol] = useState(false);
  const [nextEvent, setNextEvent] = useState(null);

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
        
        const upcoming = data.map(evt => ({
          id: evt.id,
          title: evt.title,
          date: evt.event_date,
          endDate: evt.event_end_date,
          tag: evt.event_type,
          shortDesc: evt.short_description,
          fullDesc: evt.event_briefing,
          location: evt.location,
          time: evt.event_time,
          format: evt.format
        })).filter(evt => {
          const compareDate = new Date(evt.endDate || evt.date);
          compareDate.setHours(0,0,0,0);
          return compareDate >= today;
        });
        
        if (upcoming.length > 0) {
          upcoming.sort((a, b) => new Date(a.date) - new Date(b.date));
          setNextEvent(upcoming[0]);
        }
      }
    };
    fetchNextEvent();
  }, []);

  const isLolEvent = nextEvent?.title?.toLowerCase().includes("league of legends");

  useEffect(() => {
    if (isLoggedIn && token && nextEvent && isLolEvent) {
      const checkLolStatus = async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/api/register-lol/status`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (response.ok) {
            const data = await response.json();
            setIsRegisteredForLol(data.is_registered);
          }
        } catch (e) {
          console.error("Error checking lol registration status in layout:", e);
        }
      };
      checkLolStatus();
    } else {
      setIsRegisteredForLol(false);
    }
  }, [isLoggedIn, token, nextEvent, isLolEvent]);

  useEffect(() => {
    const handleOpenModal = () => setIsModalOpen(true);
    window.addEventListener('open-event-details-modal', handleOpenModal);
    return () => window.removeEventListener('open-event-details-modal', handleOpenModal);
  }, []);

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <Navbar />

      {/* Dynamic Upcoming Event Popup Banner */}
      {isBannerVisible && nextEvent && (
        <motion.div
          initial={{ opacity: 0, x: 100, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 90, damping: 15, delay: 0.6 }}
          className="fixed top-[84px] right-2 sm:right-4 z-40 max-w-[calc(100%-1rem)]"
        >
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-3.5 px-5 py-3 rounded-2xl border border-outline-variant/35 bg-surface-container/95 backdrop-blur-md hover:border-primary/60 hover:shadow-[0_4px_16px_rgba(242,202,80,0.15)] transition-all duration-300 group cursor-pointer text-sm text-left shadow-lg"
          >
            <span className="material-symbols-outlined text-primary text-xl shrink-0 animate-pulse">
              campaign
            </span>
            <div className="flex flex-col justify-center min-w-0">
              <span className="font-bold text-on-surface truncate max-w-[130px] xs:max-w-[170px] sm:max-w-[210px] md:max-w-[260px] leading-tight text-sm">
                {nextEvent.title}
              </span>
              <span className="text-[10px] text-on-surface-variant font-medium font-mono mt-0.5 leading-none">
                {nextEvent.date}
              </span>
            </div>
            <span className="material-symbols-outlined text-primary text-base group-hover:translate-x-0.5 transition-transform shrink-0 ml-1">
              arrow_forward
            </span>
            <span
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsBannerVisible(false);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsBannerVisible(false);
                }
              }}
              className="p-0.5 hover:bg-surface-container-highest rounded-full text-on-surface-variant hover:text-on-surface transition-colors flex items-center justify-center shrink-0 ml-0.5"
            >
              <span className="material-symbols-outlined text-[13px]">close</span>
            </span>
          </button>
        </motion.div>
      )}

      <main className="w-full">
        {children}
      </main>

      {/* Event Details Modal Window */}
      {isModalOpen && nextEvent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-[#0e0e0e]/80 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          ></motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="bg-[#1c1b1b] border border-outline-variant/20 rounded-2xl w-full max-w-4xl relative z-10 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between px-8 py-6 border-b border-outline-variant/10 shrink-0">
              <div className="min-w-0 pr-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary font-mono">
                  Upcoming Event Details
                </span>
                <h2 className="text-2xl font-serif text-on-surface mt-1 leading-tight">
                  {nextEvent.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 hover:bg-surface-container-highest rounded-full text-on-surface-variant hover:text-on-surface transition-colors flex items-center justify-center shrink-0"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            {/* Modal Scrollable Content */}
            <div className="p-8 md:p-10 overflow-y-auto space-y-6 flex-1 disable-scrollbar">
              {/* Event Brief */}
              <div>
                <h4 className="mb-2 text-[10px] font-label uppercase tracking-widest text-primary font-bold">
                  Event Briefing
                </h4>
                <p className="text-sm leading-relaxed text-on-surface-variant">
                  {nextEvent.fullDesc || nextEvent.shortDesc}
                </p>
              </div>

              {/* Event Overview Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-xl border border-outline-variant/10 bg-[#131313] p-4 flex gap-3 items-start col-span-1">
                  <span className="material-symbols-outlined text-primary shrink-0">location_on</span>
                  <div>
                    <h5 className="text-[10px] font-label uppercase tracking-wider text-on-surface-variant">
                      Location
                    </h5>
                    <p className="text-xs font-bold text-on-surface mt-0.5">
                      {nextEvent.location}
                    </p>
                  </div>
                </div>

                <div className="rounded-xl border border-outline-variant/10 bg-[#131313] p-4 flex gap-3 items-start col-span-1">
                  <span className="material-symbols-outlined text-primary shrink-0">schedule</span>
                  <div>
                    <h5 className="text-[10px] font-label uppercase tracking-wider text-on-surface-variant">
                      Time / Date
                    </h5>
                    <p className="text-xs font-bold text-on-surface mt-0.5">
                      {nextEvent.date} ({nextEvent.time || 'TBD'})
                    </p>
                  </div>
                </div>

                <div className="rounded-xl border border-outline-variant/10 bg-[#131313] p-4 flex gap-3 items-start col-span-1">
                  <span className="material-symbols-outlined text-primary shrink-0">sports_esports</span>
                  <div>
                    <h5 className="text-[10px] font-label uppercase tracking-wider text-on-surface-variant">
                      Match Format
                    </h5>
                    <p className="text-xs font-bold text-on-surface mt-0.5">
                      {nextEvent.format || "Tournament System"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Honors / Prizes */}
              {nextEvent.prizes && (
                <div className="rounded-xl border border-primary/20 bg-[#131313] p-4 flex gap-3 items-start">
                  <span className="material-symbols-outlined text-primary shrink-0">emoji_events</span>
                  <div>
                    <h4 className="text-[10px] font-label uppercase tracking-wider text-on-surface-variant">
                      Prizes & Honors
                    </h4>
                    <p className="text-xs font-bold text-primary mt-0.5">
                      {nextEvent.prizes}
                    </p>
                  </div>
                </div>
              )}

              {/* Agenda Overview (Schedule) */}
              {nextEvent.schedule && nextEvent.schedule.length > 0 && (
                <div>
                  <h4 className="mb-3 text-[10px] font-label uppercase tracking-widest text-primary font-bold">
                    Agenda Overview
                  </h4>
                  <div className="space-y-3 rounded-xl border border-outline-variant/10 bg-[#131313] p-4 sm:p-5">
                    {nextEvent.schedule.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-4">
                        <span className="w-20 shrink-0 text-xs font-bold text-on-surface-variant pt-0.5 font-mono">
                          {item.time}
                        </span>
                        <span className="h-1.5 w-1.5 rounded-full bg-primary/60 mt-2 shrink-0"></span>
                        <span className="text-xs text-on-surface leading-normal">
                          {item.activity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer Actions */}
            <div className="px-8 py-6 border-t border-outline-variant/10 bg-[#131313]/60 flex items-center justify-between gap-3 shrink-0">
              <div>
                <Link
                  to="/events"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-primary/20 text-xs font-bold uppercase tracking-wider text-primary hover:bg-primary/10 transition-colors flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">event_note</span>
                  Other Events
                </Link>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-outline-variant/30 text-xs font-bold uppercase tracking-wider text-on-surface hover:bg-surface-container-highest transition-colors"
                >
                  Close
                </button>
                {isLoggedIn ? (
                  isRegisteredForLol && isLolEvent ? (
                    <button
                      disabled
                      className="px-6 py-2.5 rounded-xl bg-gray-800 text-gray-500 text-xs font-bold uppercase tracking-wider border border-gray-700 cursor-not-allowed"
                    >
                      REGISTERED ✓
                    </button>
                  ) : (
                    <Link
                      to="/events"
                      state={isLolEvent ? { scrollToEventId: nextEvent.id, openRegisterLol: true } : { scrollToEventId: nextEvent.id, openRegisterForEventId: nextEvent.id }}
                      onClick={() => setIsModalOpen(false)}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#f2ca50] to-[#d4af37] text-xs font-bold uppercase tracking-wider text-[#3c2f00] shadow-lg transition-transform hover:scale-[1.02]"
                    >
                      Register Now
                    </Link>
                  )
                ) : (
                  <Link
                    to={`/login?redirect=/events&openRegisterForEventId=${nextEvent.id}`}
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#f2ca50] to-[#d4af37] text-xs font-bold uppercase tracking-wider text-[#3c2f00] shadow-lg transition-transform hover:scale-[1.02]"
                  >
                    Login to Register
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}

      <ScrollToTopButton />
    </div>
  );
};

export default MainLayout;
