import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Footer from '../components/Footer';
import { API_BASE_URL } from '../config';
import { globalCache } from '../utils/cache';

const Results = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loadingEvent, setLoadingEvent] = useState(true);

  useEffect(() => {
    const fetchEventDetails = async () => {
      let foundEvent = null;
      if (globalCache.events && Array.isArray(globalCache.events)) {
        foundEvent = globalCache.events.find(e => `db-${e.id}` === id || String(e.id) === id);
      }
      
      if (!foundEvent) {
        try {
          const res = await fetch(`${API_BASE_URL}/api/events`);
          if (res.ok) {
            const data = await res.json();
            globalCache.events = data;
            foundEvent = data.find(e => `db-${e.id}` === id || String(e.id) === id);
          }
        } catch (e) {
          console.error("Error loading events for results page:", e);
        }
      }
      
      setEvent(foundEvent);
      setLoadingEvent(false);
    };
    fetchEventDetails();
  }, [id]);

  return (
    <div className="min-h-screen text-on-surface pt-4 sm:pt-6 font-sans relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 relative">
        
        {/* Header Section */}
        <div className="flex justify-between items-end border-b border-outline-variant/10 pb-8 mb-10">
          <div className="max-w-3xl">
            {loadingEvent ? (
              <div className="h-10 w-64 bg-surface-container-high animate-pulse rounded-lg mb-3"></div>
            ) : (
              <h1 className="text-4xl font-serif leading-tight text-on-surface sm:text-5xl">
                {event ? `${event.title} Standings` : 'Tournament Results'}
              </h1>
            )}
            <p className="mt-3 text-sm font-light leading-relaxed text-on-surface-variant/80 sm:text-base">
              The official standings, scorecards, and results from Chess Club IIT Kanpur's historical tournaments.
            </p>
          </div>
        </div>

        {/* Empty State Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center py-24 text-center bg-surface-container-low border border-outline-variant/10 rounded-3xl p-8"
        >
          <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-6 shadow-inner">
            <span className="material-symbols-outlined text-3xl font-light">emoji_events</span>
          </div>
          <h3 className="text-2xl font-serif font-bold text-on-surface mb-2">No Standings Recorded</h3>
          <p className="text-on-surface-variant/70 text-sm max-w-sm leading-relaxed mb-8">
            Detailed standings and round summaries will be updated here as tournament data is processed.
          </p>
          <Link 
            to="/events" 
            state={{ defaultTab: 'past' }}
            className="px-6 py-2.5 rounded-xl bg-primary text-[#3c2f00] font-bold text-xs font-label uppercase tracking-widest hover:bg-[#d4af37] transition-all shadow-md shadow-primary/10 flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Return to Events
          </Link>
        </motion.div>

      </div>
      <Footer />
    </div>
  );
};

export default Results;
