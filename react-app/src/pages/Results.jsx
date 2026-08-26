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
  const [standings, setStandings] = useState([]);
  const [loadingStandings, setLoadingStandings] = useState(true);

  useEffect(() => {
    const fetchEventDetailsAndStandings = async () => {
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

      const realId = id.startsWith('db-') ? id.replace('db-', '') : id;
      try {
        const res = await fetch(`${API_BASE_URL}/api/events/${realId}/standings`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setStandings(data);
          }
        }
      } catch (e) {
        console.error("Error loading standings data:", e);
      } finally {
        setLoadingStandings(false);
      }
    };
    
    fetchEventDetailsAndStandings();
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

        {/* Loading / Standings / Empty State */}
        {loadingStandings ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : standings.length === 0 ? (
          /* Empty State Section */
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
        ) : (
          /* Standings Table Section */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-surface-container-low border border-outline-variant/10 rounded-3xl overflow-hidden shadow-xl"
          >
            <div className="px-6 py-5 border-b border-outline-variant/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-2xl font-light">leaderboard</span>
                <span className="font-serif font-bold text-lg text-on-surface">Leaderboard</span>
              </div>
              <Link 
                to="/events" 
                state={{ defaultTab: 'past' }}
                className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-primary hover:text-[#d4af37] transition-colors"
              >
                <span className="material-symbols-outlined text-sm">arrow_back</span>
                Return to Events
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container/40 border-b border-outline-variant/10 text-[10px] font-mono font-bold uppercase tracking-wider text-on-surface-variant/80">
                    <th className="py-4 px-6 text-center w-20">Rank</th>
                    <th className="py-4 px-6">Name</th>
                    <th className="py-4 px-6 w-40">Roll Number</th>
                    <th className="py-4 px-6 text-center w-28">Score</th>
                    <th className="py-4 px-6 text-center w-28">BH (TB1)</th>
                    <th className="py-4 px-6 text-center w-28">SB (TB2)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/5">
                  {standings.map((row, idx) => {
                    const isPodium = idx < 3;
                    const podiumColors = [
                      'text-[#ffd700] bg-[#ffd700]/10 border-[#ffd700]/20', // Gold
                      'text-[#c0c0c0] bg-[#c0c0c0]/10 border-[#c0c0c0]/20', // Silver
                      'text-[#cd7f32] bg-[#cd7f32]/10 border-[#cd7f32]/20'  // Bronze
                    ];
                    
                    return (
                      <tr key={idx} className="hover:bg-surface-container-high/20 transition-colors">
                        <td className="py-4 px-6 text-center">
                          {isPodium ? (
                            <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full border text-sm font-serif font-bold ${podiumColors[idx]}`}>
                              {row.rank}
                            </span>
                          ) : (
                            <span className="text-sm font-mono text-on-surface-variant/80">{row.rank}</span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-sm font-semibold text-on-surface">
                          {row.name}
                        </td>
                        <td className="py-4 px-6 text-sm font-mono text-on-surface-variant/80">
                          {row.roll_no || '-'}
                        </td>
                        <td className="py-4 px-6 text-center text-sm font-bold text-primary">
                          {row.score}
                        </td>
                        <td className="py-4 px-6 text-center text-sm font-mono text-on-surface-variant/70">
                          {row.tb1 || '-'}
                        </td>
                        <td className="py-4 px-6 text-center text-sm font-mono text-on-surface-variant/70">
                          {row.tb2 || '-'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

      </div>
      <Footer />
    </div>
  );
};

export default Results;
