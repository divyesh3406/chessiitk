import { useState, useEffect } from 'react';
import AddEventModal from '../components/AddEventModal';
import ViewDayModal from '../components/ViewDayModal';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import { API_BASE_URL } from '../config';

const PRE_SCHEDULED_EVENTS = [];
// A dictionary to map event types to their specific colors
const eventTheme = {
  tournament: { 
    border: 'border-[#f2ca50]', 
    bg: 'bg-[#f2ca50]/10', 
    text: 'text-[#f2ca50]' 
  },
  workshop: { 
    border: 'border-[#e5e2e1]', 
    bg: 'bg-[#e5e2e1]/5', 
    text: 'text-white' 
  },
  league: { 
    border: 'border-purple-500', 
    bg: 'bg-purple-500/10', 
    text: 'text-purple-400' 
  },
  casual: { 
    border: 'border-green-500', 
    bg: 'bg-green-500/10', 
    text: 'text-green-400' 
  },
  // The fallback color if an event type doesn't match the ones above
  default: { 
    border: 'border-[#60a5fa]', 
    bg: 'bg-[#60a5fa]/10', 
    text: 'text-blue-400' 
  }
};

const Calendar = () => {
  const { isLoggedIn, token, user } = useAuth();
  const navigate = useNavigate(); // Initialize the router navigation

  const [currentDate, setCurrentDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );
  
  // 1. New states for database events
  const [dbEvents, setDbEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // We can kill the modal states for events since we are redirecting now!
  const [viewMode, setViewMode] = useState(window.innerWidth < 768 ? 'list' : 'calendar');

  // Keep filters if you want to keep the checkboxes, otherwise they can be removed too
  const [showTournaments, setShowTournaments] = useState(true);
  const [showWorkshops, setShowWorkshops] = useState(true);

  // 2. Fetch from your new API!
  useEffect(() => {
    const fetchCalendarEvents = async () => {
      try {

        const response = await fetch(`${API_BASE_URL}/api/events`);
        
        if (response.ok) {
          const data = await response.json();
          
          // Map backend data to what the calendar grid expects
          const formattedEvents = data.map(evt => {
             const yyyyMmDd = new Date(evt.event_date).toISOString().split('T')[0];
             const endYyyyMmDd = evt.event_end_date ? new Date(evt.event_end_date).toISOString().split('T')[0] : null;
             
             return {
               id: `db-${evt.id}`,
               title: evt.title,
               date: yyyyMmDd,
               endDate: endYyyyMmDd,
               type: evt.event_type.toLowerCase(),
               time: evt.event_time,
               location: evt.location
             };
          });
          
          setDbEvents(formattedEvents);
        }
      } catch (error) {
        console.error("Failed to fetch events for calendar:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCalendarEvents();
  }, []);

  // 3. Merge the hardcoded events with the dynamic database events
  const allEvents = [
    ...PRE_SCHEDULED_EVENTS,
    ...dbEvents
  ].filter(e => {
    if (e.type === 'tournament' && !showTournaments) return false;
    if (e.type === 'workshop' && !showWorkshops) return false;
    return true;
  });

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const currentMonthStr = `${year}-${String(month + 1).padStart(2, '0')}`;
  const currentMonthEvents = allEvents
    .filter((e) => {
      const startInMonth = e.date && e.date.startsWith(currentMonthStr);
      const endInMonth = e.endDate && e.endDate.startsWith(currentMonthStr);
      return startInMonth || endInMonth;
    })
    .sort((a, b) => a.date.localeCompare(b.date));

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const calendarCells = [];

  for (let i = 0; i < firstDayOfMonth; i++) {
    const day = daysInPrevMonth - firstDayOfMonth + i + 1;
    calendarCells.push({ type: 'prev', day });
  }

  for (let i = 1; i <= daysInMonth; i++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    calendarCells.push({ type: 'current', day: i, dateStr });
  }

  const totalCellsNeeded = calendarCells.length > 35 ? 42 : 35;
  const remainingCells = totalCellsNeeded - calendarCells.length;

  for (let i = 1; i <= remainingCells; i++) {
    calendarCells.push({ type: 'next', day: i });
  }

  // Map absolute date strings to prev and next month cells
  const cellsWithDate = calendarCells.map((cell) => {
    if (cell.dateStr) return cell;
    
    let dateStr = '';
    if (cell.type === 'prev') {
      const prevMonth = month === 0 ? 11 : month - 1;
      const prevYear = month === 0 ? year - 1 : year;
      dateStr = `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}-${String(cell.day).padStart(2, '0')}`;
    } else if (cell.type === 'next') {
      const nextMonth = month === 11 ? 0 : month + 1;
      const nextYear = month === 11 ? year + 1 : year;
      dateStr = `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-${String(cell.day).padStart(2, '0')}`;
    }
    return { ...cell, dateStr };
  });

  // Split cells into rows of weeks (7 days each)
  const gridWeeks = [];
  for (let i = 0; i < cellsWithDate.length; i += 7) {
    gridWeeks.push(cellsWithDate.slice(i, i + 7));
  }

  const isEventOnDate = (event, dateStr) => {
    if (!event.date || !dateStr) return false;
    if (event.endDate) {
      return dateStr >= event.date && dateStr <= event.endDate;
    }
    return dateStr === event.date;
  };

  // Pre-calculate track assignments for each week row to avoid overlaps
  const weeksData = gridWeeks.map((week) => {
    const weekEvents = allEvents.filter(event => {
      return week.some(cell => isEventOnDate(event, cell.dateStr));
    });

    const getDuration = (e) => {
      if (!e.endDate) return 1;
      return Math.max(1, Math.round((new Date(e.endDate) - new Date(e.date)) / (1000 * 60 * 60 * 24)) + 1);
    };

    // Sort by duration descending, then by start date ascending
    const sortedWeekEvents = [...weekEvents].sort((a, b) => {
      const durA = getDuration(a);
      const durB = getDuration(b);
      if (durA !== durB) return durB - durA;
      return a.date.localeCompare(b.date);
    });

    const tracks = [];
    const eventTrackAssignments = {};

    sortedWeekEvents.forEach(event => {
      const activeDays = week.map(cell => isEventOnDate(event, cell.dateStr));
      
      let assignedTrack = -1;
      for (let t = 0; t < tracks.length; t++) {
        let isFree = true;
        for (let d = 0; d < 7; d++) {
          if (activeDays[d] && tracks[t][d]) {
            isFree = false;
            break;
          }
        }
        if (isFree) {
          assignedTrack = t;
          break;
        }
      }
      
      if (assignedTrack === -1) {
        assignedTrack = tracks.length;
        tracks.push(new Array(7).fill(false));
      }
      
      for (let d = 0; d < 7; d++) {
        if (activeDays[d]) {
          tracks[assignedTrack][d] = true;
        }
      }
      
      eventTrackAssignments[event.id] = assignedTrack;
    });

    console.log("Week row:", week[0].dateStr, "to", week[6].dateStr, "Assignments:", JSON.stringify(eventTrackAssignments), "Max tracks:", tracks.length);

    return {
      week,
      events: sortedWeekEvents,
      eventTrackAssignments,
      maxTracksCount: tracks.length
    };
  });

  useEffect(() => {
    if (dbEvents.length > 0 && user?.is_admin && token) {
      const logMsg = weeksData.map((wData, idx) => {
        return `Week ${idx}: ${wData.week[0].dateStr} to ${wData.week[6].dateStr} Assignments: ${JSON.stringify(wData.eventTrackAssignments)} Max tracks: ${wData.maxTracksCount}`;
      }).join('\n');
      
      fetch(`${API_BASE_URL}/api/events/debug_log`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ msg: logMsg })
      }).catch(() => {});
    }
  }, [dbEvents, weeksData, user, token]);

  const handleScheduleClick = () => {
    const today = new Date();
    const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    setSelectedDate(dateStr);
    setIsModalOpen(true);
  };
return (
    <>
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="mx-auto min-h-screen max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10"
      >
        <div className="mb-8 md:mb-10">
          <div className="max-w-3xl">
            <h2 className="text-4xl font-serif leading-tight text-on-surface sm:text-5xl">
Upcoming Events
            </h2>
            <p className="mt-3 text-sm font-light leading-relaxed text-on-surface-variant/80 sm:text-base">
              Stay up to date with the IITK Chess Community's upcoming tournaments, workshops, and events.
            </p>
          </div>
        </div>

        {/* Removed the 12-column grid to let the calendar take 100% width! */}
        <div className="w-full">
            <div className={`flex flex-col overflow-hidden rounded-2xl border border-outline-variant/10 bg-surface-container-low ${viewMode === 'calendar' ? 'min-h-[720px]' : ''}`}>
              <div className="flex shrink-0 items-center justify-between border-b border-outline-variant/10 px-4 py-4 sm:px-6">
                <h3 className="text-2xl font-serif font-bold text-on-surface sm:text-3xl">
                  {monthName}{' '}
                  <span className="font-normal text-on-surface-variant/50">
                    {year}
                  </span>
                </h3>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode(viewMode === 'calendar' ? 'list' : 'calendar')}
                    className="flex items-center gap-1.5 rounded-lg border border-outline-variant/20 px-3 py-1.5 text-xs text-on-surface hover:bg-surface-container transition-colors outline-none mr-2"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {viewMode === 'calendar' ? 'list' : 'calendar_month'}
                    </span>
                    <span className="hidden sm:inline">{viewMode === 'calendar' ? 'List View' : 'Calendar View'}</span>
                  </button>

                  <button
                    onClick={handlePrevMonth}
                    className="rounded-lg p-2 outline-none transition-colors hover:bg-surface-container"
                  >
                    <span className="material-symbols-outlined">chevron_left</span>
                  </button>
                  <button
                    onClick={handleNextMonth}
                    className="rounded-lg p-2 outline-none transition-colors hover:bg-surface-container"
                  >
                    <span className="material-symbols-outlined">chevron_right</span>
                  </button>
                </div>
              </div>

              {/* LIST VIEW */}
              {viewMode === 'list' ? (
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 max-h-[640px] disable-scrollbar">
                  {currentMonthEvents.length === 0 ? (
                    <div className="text-center py-16 text-on-surface-variant/50">
                      <span className="material-symbols-outlined text-5xl mb-3 opacity-50">event_busy</span>
                      <p className="text-sm font-label uppercase tracking-widest">No events scheduled for this month</p>
                    </div>
                  ) : (
                    currentMonthEvents.map((evt, idx) => {
                      let formattedDate = evt.date;
                      try {
                        const [y, m, d] = evt.date.split('-');
                        const dateObj = new Date(y, m - 1, d);
                        formattedDate = dateObj.toLocaleDateString('default', { month: 'long', day: 'numeric', year: 'numeric' });
                      } catch (e) {}

                      return (
                        <div
                          key={idx}
                          // Redirect to events page instead of opening a modal
                          onClick={() => navigate('/events', { state: { scrollToEventId: evt.id } })}
                          className={`p-4 rounded-xl border-l-[4px] bg-surface-container-high transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:border-primary/50 hover:bg-surface-container-highest ${
                            evt.type === 'tournament' ? 'border-[#f2ca50]' : 
                            evt.type === 'workshop' ? 'border-[#e5e2e1]' : 
                            'border-[#60a5fa]'
                          }`}
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2 flex-wrap">
                              <span className="text-[10px] font-mono font-bold text-on-surface-variant/60">
                                {formattedDate}
                              </span>
                              <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                                evt.type === 'tournament' ? 'bg-[#f2ca50]/15 text-[#f2ca50]' : 
                                evt.type === 'workshop' ? 'bg-[#e5e2e1]/15 text-[#e5e2e1]' : 
                                'bg-[#60a5fa]/15 text-blue-400'
                              }`}>
                                {evt.type}
                              </span>
                            </div>
                            <h4 className="text-base sm:text-lg font-serif font-bold text-on-surface truncate">{evt.title}</h4>
                          </div>

                          <div className="flex flex-wrap items-center gap-4 text-xs text-on-surface-variant shrink-0">
                            <div className="flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-[16px]">location_on</span>
                              <span>{evt.location}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-[16px]">schedule</span>
                              <span>{evt.time}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              ) : (
                /* CALENDAR VIEW */
                <>
                  <div className="grid shrink-0 grid-cols-7 text-center border-b border-outline-variant/10">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
                      <div
                        key={i}
                        className="py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/50"
                      >
                        {day}
                      </div>
                    ))}
                  </div>

                  <div className="flex-1 flex flex-col divide-y divide-outline-variant/10 border-l border-r border-b border-outline-variant/10">
                    {weeksData.map((weekData, weekIdx) => {
                      const week = weekData.week;
                      const maxTracks = weekData.maxTracksCount;
                      
                      return (
                        <div key={weekIdx} className="grid grid-cols-7 relative min-h-[145px] divide-x divide-outline-variant/5">
                          {/* 1. Background day cells */}
                          {week.map((cell, dayIdx) => {
                            const isCurrent = cell.type === 'current';
                            const isToday = isCurrent && cell.dateStr === todayStr;
                            
                            // Highlight dates that contain any active event
                            const dayEvents = allEvents.filter((e) => isEventOnDate(e, cell.dateStr));
                            
                            const bgClass = isCurrent
                              ? 'bg-transparent transition-colors hover:bg-surface-container-high'
                              : 'bg-surface-container-lowest opacity-30';

                            return (
                              <div
                                key={dayIdx}
                                className={`p-2 sm:p-3 flex flex-col justify-start items-start ${bgClass}`}
                              >
                                <span
                                  className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                                    isToday
                                      ? 'bg-primary text-black font-bold shadow-[0_0_12px_rgba(242,202,80,0.8)] ring-1 ring-primary/40'
                                      : dayEvents.length > 0 && isCurrent
                                      ? 'font-bold text-primary'
                                      : 'font-medium text-on-surface/80'
                                  }`}
                                >
                                  {cell.day}
                                </span>
                              </div>
                            );
                          })}

                          {/* 2. Track Event Banners Overlay */}
                          <div className="absolute top-10 left-0 right-0 bottom-0 pointer-events-none flex flex-col gap-1.5 px-1.5 py-1">
                            {Array.from({ length: maxTracks }).map((_, tIdx) => {
                              // Find events on this track in this week
                              const trackEvents = weekData.events.filter(e => weekData.eventTrackAssignments[e.id] === tIdx);
                              
                              return (
                                <div key={tIdx} className="grid grid-cols-7 w-full h-[26px] relative pointer-events-none gap-x-1.5">
                                  {trackEvents.map(evt => {
                                    const activeDays = week.map(cell => isEventOnDate(evt, cell.dateStr));
                                    const startIdx = activeDays.indexOf(true);
                                    const endIdx = activeDays.lastIndexOf(true);
                                    
                                    if (startIdx === -1) return null;
                                    
                                    const theme = eventTheme[evt.type] || eventTheme.default;
                                    
                                    return (
                                      <div
                                        key={evt.id}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          navigate('/events', { state: { scrollToEventId: evt.id } });
                                        }}
                                        style={{
                                          gridColumnStart: startIdx + 1,
                                          gridColumnEnd: endIdx + 2,
                                          gridRowStart: 1
                                        }}
                                        title={`${evt.title} (${evt.location})`}
                                        className={`cursor-pointer pointer-events-auto h-[26px] flex items-center justify-center text-center px-3 text-[10px] font-bold rounded border-l-[3px] transition-opacity hover:opacity-85 shadow-[0_1px_3px_rgba(0,0,0,0.3)] ${theme.border} ${theme.bg} ${theme.text}`}
                                      >
                                        <span className="truncate leading-none">{evt.title}</span>
                                      </div>
                                    );
                                  })}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
        </div> 
      </motion.main>

      <Footer />
    </>
  );
};
export default Calendar;
