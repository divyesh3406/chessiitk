import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../config';
import Footer from '../components/Footer';

const AdminPortal = () => {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Stats & Logs States
  const [stats, setStats] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);

  // Alumni Queue States
  const [alumniRequests, setAlumniRequests] = useState([]);
  const [loadingAlumni, setLoadingAlumni] = useState(false);
  const [alumniStatusFilter, setAlumniStatusFilter] = useState('pending');
  const [approvalResult, setApprovalResult] = useState(null); // { email, temp_password }

  // Registrations States
  const [selectedRegEvent, setSelectedRegEvent] = useState('fcl');
  const [registrations, setRegistrations] = useState([]);
  const [loadingRegs, setLoadingRegs] = useState(false);
  const [exportingCsv, setExportingCsv] = useState(false);

  // Standings Editor States
  const [eventsList, setEventsList] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [standingsRows, setStandingsRows] = useState([]);
  const [loadingStandings, setLoadingStandings] = useState(false);
  const [savingStandings, setSavingStandings] = useState(false);

  // Members Directory States
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState('');

  // --- 1. OVERVIEW & LOGS ---
  const fetchOverviewData = async () => {
    setLoadingStats(true);
    try {
      const statsRes = await fetch(`${API_BASE_URL}/api/admin/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      const logsRes = await fetch(`${API_BASE_URL}/api/admin/audit-logs`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (logsRes.ok) {
        const logsData = await logsRes.json();
        setLogs(logsData);
      }
    } catch (e) {
      console.error("Error fetching admin overview:", e);
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'overview') {
      fetchOverviewData();
    }
  }, [activeTab]);


  // --- 2. ALUMNI QUEUE ---
  const fetchAlumniRequests = async () => {
    setLoadingAlumni(true);
    setApprovalResult(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/alumni-requests?status=${alumniStatusFilter}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setAlumniRequests(data);
      }
    } catch (e) {
      console.error("Error fetching alumni requests:", e);
    } finally {
      setLoadingAlumni(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'alumni') {
      fetchAlumniRequests();
    }
  }, [activeTab, alumniStatusFilter]);

  const handleApproveAlumni = async (id, email) => {
    if (!window.confirm(`Are you sure you want to approve request for ${email}? This will create their user profile.`)) {
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/alumni-requests/${id}/approve`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setApprovalResult({ email: email });
        // Refresh requests list
        fetchAlumniRequests();
      } else {
        alert(data.error || "Approval failed.");
      }
    } catch (e) {
      console.error("Error approving alumni:", e);
    }
  };

  const handleRejectAlumni = async (id, email) => {
    if (!window.confirm(`Are you sure you want to reject request for ${email}?`)) {
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/alumni-requests/${id}/reject`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        alert("Request rejected successfully.");
        fetchAlumniRequests();
      } else {
        alert(data.error || "Rejection failed.");
      }
    } catch (e) {
      console.error("Error rejecting alumni:", e);
    }
  };


  // --- 3. REGISTRATIONS ---
  const fetchRegistrations = async () => {
    setLoadingRegs(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/registrations/${selectedRegEvent}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setRegistrations(data);
      }
    } catch (e) {
      console.error("Error fetching registrations:", e);
    } finally {
      setLoadingRegs(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'registrations') {
      fetchRegistrations();
    }
  }, [activeTab, selectedRegEvent]);

  const handleDownloadCSV = async () => {
    setExportingCsv(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/registrations/${selectedRegEvent}/csv`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${selectedRegEvent}_registrations_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      } else {
        alert("Failed to export CSV.");
      }
    } catch (e) {
      console.error("CSV Export failure:", e);
    } finally {
      setExportingCsv(false);
    }
  };


  // --- 4. STANDINGS EDITOR ---
  useEffect(() => {
    if (activeTab === 'standings') {
      // Fetch events list to populate dropdown
      const fetchEvents = async () => {
        try {
          const res = await fetch(`${API_BASE_URL}/api/events`);
          if (res.ok) {
            const data = await res.json();
            // Show only database events, sort chronologically
            const mapped = data.map(e => ({ id: e.id, title: e.title })).sort((a,b) => b.id - a.id);
            setEventsList(mapped);
            if (mapped.length > 0) {
              setSelectedEventId(mapped[0].id);
            }
          }
        } catch (e) {
          console.error("Error loading events for standings selector:", e);
        }
      };
      fetchEvents();
    }
  }, [activeTab]);

  const fetchStandingsForEvent = async (eventId) => {
    if (!eventId) return;
    setLoadingStandings(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/events/${eventId}/standings`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setStandingsRows(data);
        } else {
          // Initialize with some blank rows if none exist
          setStandingsRows([
            { rank: '1', name: '', roll_no: '', score: '', tb1: '', tb2: '' },
            { rank: '2', name: '', roll_no: '', score: '', tb1: '', tb2: '' },
            { rank: '3', name: '', roll_no: '', score: '', tb1: '', tb2: '' }
          ]);
        }
      }
    } catch (e) {
      console.error("Error loading standings:", e);
    } finally {
      setLoadingStandings(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'standings' && selectedEventId) {
      fetchStandingsForEvent(selectedEventId);
    }
  }, [activeTab, selectedEventId]);

  const handleRowChange = (index, field, value) => {
    const updated = [...standingsRows];
    updated[index][field] = value;
    setStandingsRows(updated);
  };

  const handleAddStandingsRow = () => {
    const nextRank = String(standingsRows.length + 1);
    setStandingsRows([
      ...standingsRows,
      { rank: nextRank, name: '', roll_no: '', score: '', tb1: '', tb2: '' }
    ]);
  };

  const handleRemoveStandingsRow = (index) => {
    const updated = standingsRows.filter((_, i) => i !== index).map((row, idx) => ({
      ...row,
      rank: String(idx + 1)
    }));
    setStandingsRows(updated);
  };

  const handleSaveStandings = async () => {
    if (!selectedEventId) return;
    setSavingStandings(true);
    // Filter out completely empty rows
    const cleaned = standingsRows.filter(r => r.name.trim() !== '');
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/events/${selectedEventId}/standings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(cleaned)
      });
      if (res.ok) {
        alert("Standings saved and published successfully!");
        fetchStandingsForEvent(selectedEventId);
      } else {
        const data = await res.json();
        alert(data.error || "Failed to save standings.");
      }
    } catch (e) {
      console.error("Save standings failure:", e);
    } finally {
      setSavingStandings(false);
    }
  };


  // --- 5. MEMBERS DIRECTORY ---
  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (e) {
      console.error("Error loading user directory:", e);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'members') {
      fetchUsers();
    }
  }, [activeTab]);

  const filteredUsers = users.filter(u => {
    const query = userSearchQuery.toLowerCase();
    return (
      (u.name && u.name.toLowerCase().includes(query)) ||
      (u.email && u.email.toLowerCase().includes(query)) ||
      (u.roll_no && u.roll_no.toLowerCase().includes(query)) ||
      (u.chess_username && u.chess_username.toLowerCase().includes(query))
    );
  });

  return (
    <div className="min-h-screen text-on-surface pt-4 sm:pt-6 font-sans relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 relative">
        {/* Header Block */}
        <div className="border-b border-outline-variant/10 pb-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-4xl font-serif leading-tight text-on-surface sm:text-5xl">
              Admin Portal
            </h1>
            <p className="mt-2 text-sm font-light text-on-surface-variant/80">
              Club maintenance dashboard, verify requests, monitor entries, and publish results.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap bg-surface-container border border-outline-variant/15 p-1 rounded-xl gap-1 shrink-0">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                activeTab === 'overview' ? 'bg-primary text-[#3c2f00]' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('alumni')}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                activeTab === 'alumni' ? 'bg-primary text-[#3c2f00]' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Alumni Requests
            </button>
            <button
              onClick={() => setActiveTab('registrations')}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                activeTab === 'registrations' ? 'bg-primary text-[#3c2f00]' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Registrations
            </button>
            <button
              onClick={() => setActiveTab('standings')}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                activeTab === 'standings' ? 'bg-primary text-[#3c2f00]' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Standings Editor
            </button>
            <button
              onClick={() => setActiveTab('members')}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                activeTab === 'members' ? 'bg-primary text-[#3c2f00]' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Members
            </button>
          </div>
        </div>

        {/* --- TAB CONTENT: OVERVIEW --- */}
        {activeTab === 'overview' && (
          <div className="space-y-10">
            {loadingStats ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : (
              <>
                {/* Stats Cards Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-surface-container-low border border-outline-variant/10 rounded-2xl p-6 shadow-sm">
                    <div className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest font-mono">Total Users</div>
                    <div className="text-4xl font-serif text-primary mt-2 font-bold">{stats?.total_users || 0}</div>
                  </div>
                  <div className="bg-surface-container-low border border-outline-variant/10 rounded-2xl p-6 shadow-sm">
                    <div className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest font-mono">Pending Alumni</div>
                    <div className="text-4xl font-serif text-primary mt-2 font-bold">{stats?.pending_alumni || 0}</div>
                  </div>
                  <div className="bg-surface-container-low border border-outline-variant/10 rounded-2xl p-6 shadow-sm">
                    <div className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest font-mono">LoL Registrations</div>
                    <div className="text-4xl font-serif text-primary mt-2 font-bold">{stats?.lol_registrations || 0}</div>
                  </div>
                  <div className="bg-surface-container-low border border-outline-variant/10 rounded-2xl p-6 shadow-sm">
                    <div className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest font-mono">FCL Registrations</div>
                    <div className="text-4xl font-serif text-primary mt-2 font-bold">{stats?.fcl_registrations || 0}</div>
                  </div>
                </div>

                {/* Audit Logs section */}
                <div className="bg-surface-container-low border border-outline-variant/10 rounded-2xl p-6 sm:p-8">
                  <h3 className="text-lg font-serif font-bold text-on-surface mb-6 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-xl">history</span>
                    Recent System Audits
                  </h3>
                  {logs.length === 0 ? (
                    <p className="text-zinc-500 italic text-sm">No actions recorded in audit logs.</p>
                  ) : (
                    <div className="space-y-4 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
                      {logs.map((log) => (
                        <div key={log.id} className="border-b border-outline-variant/10 pb-3 flex justify-between items-start gap-4 text-xs">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-primary">{log.admin_email}</span>
                              <span className="px-1.5 py-0.5 bg-surface-container border border-outline-variant/20 rounded font-mono text-[9px] uppercase font-bold tracking-wider">{log.action}</span>
                            </div>
                            <p className="text-zinc-400 mt-1 leading-relaxed">{log.details}</p>
                          </div>
                          <span className="text-zinc-600 font-mono text-[10px] whitespace-nowrap">
                            {new Date(log.created_at).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* --- TAB CONTENT: ALUMNI REQUESTS QUEUE --- */}
        {activeTab === 'alumni' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center gap-4">
              <h2 className="text-xl font-serif font-bold">Alumni Authorization Queue</h2>
              {/* Filter controls */}
              <select
                value={alumniStatusFilter}
                onChange={(e) => setAlumniStatusFilter(e.target.value)}
                className="p-2.5 bg-[#111111] rounded-md border border-gray-800 focus:border-yellow-400 focus:outline-none text-xs text-gray-200"
              >
                <option value="pending">Pending Approvals</option>
                <option value="approved">Approved Requests</option>
                <option value="rejected">Rejected Requests</option>
              </select>
            </div>

            {/* Approval result warning banner */}
            {approvalResult && (
              <div className="bg-green-950/20 border border-green-900/40 p-5 rounded-2xl flex flex-col gap-2">
                <h4 className="text-sm font-bold text-green-400 flex items-center gap-2">
                  <span className="material-symbols-outlined text-xl">check_circle</span>
                  Approval Success! Alumnus Profile Activated
                </h4>
                <p className="text-xs text-zinc-300">
                  User email <strong className="text-white">{approvalResult.email}</strong> is now approved. They can now log in by clicking **Forgot Password** on the login screen to set their password via email OTP verification.
                </p>
              </div>
            )}

            {loadingAlumni ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : alumniRequests.length === 0 ? (
              <div className="bg-surface-container-low border border-outline-variant/10 p-12 text-center rounded-2xl text-zinc-500 italic text-sm">
                No alumni requests currently categorized under "{alumniStatusFilter}".
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {alumniRequests.map((req) => (
                  <div key={req.id} className="bg-surface-container-low border border-outline-variant/10 rounded-2xl p-6 shadow-sm flex flex-col justify-between gap-4">
                    <div>
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h3 className="font-serif text-lg font-bold text-on-surface">{req.name}</h3>
                          <span className="text-zinc-500 text-xs font-mono">{req.email}</span>
                        </div>
                        <span className="px-2.5 py-1 bg-surface-container border border-outline-variant/20 text-[10px] rounded-full uppercase tracking-wider font-bold text-zinc-400 font-mono">
                          Class of {req.graduation_year}
                        </span>
                      </div>

                      {/* Fields grid */}
                      <div className="grid grid-cols-2 gap-3 mt-4 text-xs border-t border-outline-variant/10 pt-4">
                        <div>
                          <span className="text-zinc-500 block">Roll Number</span>
                          <span className="font-medium text-zinc-300">{req.roll_no || 'TBD'}</span>
                        </div>
                        <div>
                          <span className="text-zinc-500 block">Chess.com Username</span>
                          <span className="font-medium text-zinc-300">{req.chess_username || 'TBD'}</span>
                        </div>
                        <div>
                          <span className="text-zinc-500 block">Contact Phone</span>
                          <span className="font-medium text-zinc-300">{req.contact || 'TBD'}</span>
                        </div>
                        <div>
                          <span className="text-zinc-500 block">Gender</span>
                          <span className="font-medium text-zinc-300">{req.gender || 'Male'}</span>
                        </div>
                      </div>

                      {req.notes && (
                        <div className="mt-4 bg-surface-container/60 p-3 rounded-lg border border-outline-variant/10 text-xs">
                          <span className="text-zinc-500 block font-bold mb-1 uppercase tracking-wide text-[9px]">Alumni Note</span>
                          <p className="text-zinc-300 leading-relaxed italic">"{req.notes}"</p>
                        </div>
                      )}
                    </div>

                    {req.status === 'pending' && (
                      <div className="flex gap-4 border-t border-outline-variant/10 pt-4 mt-2">
                        <button
                          onClick={() => handleRejectAlumni(req.id, req.email)}
                          className="flex-1 py-2 bg-red-900/20 text-red-400 border border-red-900/40 rounded-xl font-bold text-xs uppercase font-label tracking-wider hover:bg-red-900/40 hover:text-red-200 transition-colors"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => handleApproveAlumni(req.id, req.email)}
                          className="flex-1 py-2 bg-primary text-[#3c2f00] rounded-xl font-bold text-xs uppercase font-label tracking-wider hover:bg-[#d4af37] transition-all shadow-md shadow-primary/10"
                        >
                          Approve
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* --- TAB CONTENT: REGISTRATIONS LEDGER --- */}
        {activeTab === 'registrations' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-outline-variant/15 pb-4">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-serif font-bold">Event Registrations Ledger</h2>
                <select
                  value={selectedRegEvent}
                  onChange={(e) => setSelectedRegEvent(e.target.value)}
                  className="p-2.5 bg-[#111111] rounded-md border border-gray-800 focus:border-yellow-400 focus:outline-none text-xs text-gray-200"
                >
                  <option value="fcl">Fresher's Chess League</option>
                  <option value="lol">League of Legends 6.0</option>
                </select>
              </div>

              <button
                onClick={handleDownloadCSV}
                disabled={exportingCsv || registrations.length === 0}
                className="px-5 py-2.5 bg-primary text-[#3c2f00] rounded-xl font-bold text-xs uppercase font-label tracking-widest hover:bg-[#d4af37] transition-all shadow-md shadow-primary/10 flex items-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-sm">download</span>
                {exportingCsv ? "EXPORTING CSV..." : "EXPORT CSV"}
              </button>
            </div>

            {loadingRegs ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : registrations.length === 0 ? (
              <div className="bg-surface-container-low border border-outline-variant/10 p-12 text-center rounded-2xl text-zinc-500 italic text-sm">
                No registrations found for this event.
              </div>
            ) : (
              <div className="bg-surface-container-low border border-outline-variant/10 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-outline-variant/10 text-left text-xs">
                    <thead className="bg-[#151515] text-zinc-400 uppercase font-mono text-[10px] tracking-wider font-bold">
                      <tr>
                        <th className="px-6 py-4">Participant</th>
                        <th className="px-6 py-4">Roll Number</th>
                        <th className="px-6 py-4">Chess.com Username</th>
                        <th className="px-6 py-4">Contact</th>
                        <th className="px-6 py-4">Secondary Email</th>
                        <th className="px-6 py-4">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/5 text-zinc-300">
                      {registrations.map((reg) => (
                        <tr key={reg.id} className="hover:bg-surface-container-high/40 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-semibold text-white">{reg.name}</div>
                            <div className="text-zinc-500 text-[11px] font-mono">{reg.email}</div>
                          </td>
                          <td className="px-6 py-4 font-mono">{reg.roll_no || 'Not Given'}</td>
                          <td className="px-6 py-4 text-primary">{reg.chess_username || 'Not Given'}</td>
                          <td className="px-6 py-4 font-mono">{reg.contact || 'Not Given'}</td>
                          <td className="px-6 py-4 text-zinc-400">{reg.secondary_email || 'None'}</td>
                          <td className="px-6 py-4 font-mono text-zinc-500">
                            {new Date(reg.created_at).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- TAB CONTENT: STANDINGS EDITOR --- */}
        {activeTab === 'standings' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-outline-variant/15 pb-4">
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <h2 className="text-xl font-serif font-bold shrink-0">Standings Editor</h2>
                <select
                  value={selectedEventId}
                  onChange={(e) => setSelectedEventId(e.target.value)}
                  className="p-2.5 bg-[#111111] rounded-md border border-gray-800 focus:border-yellow-400 focus:outline-none text-xs text-gray-200 flex-1 sm:flex-initial max-w-sm"
                >
                  <option value="" disabled>Choose Event...</option>
                  {eventsList.map(e => (
                    <option key={e.id} value={e.id}>{e.title}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 w-full sm:w-auto justify-end">
                <button
                  onClick={handleAddStandingsRow}
                  className="px-4 py-2.5 bg-surface-container border border-outline-variant/20 rounded-xl font-bold text-xs uppercase font-label tracking-wider hover:bg-surface-container-high transition-colors"
                >
                  + Add Row
                </button>
                <button
                  onClick={handleSaveStandings}
                  disabled={savingStandings || !selectedEventId}
                  className="px-5 py-2.5 bg-primary text-[#3c2f00] rounded-xl font-bold text-xs uppercase font-label tracking-widest hover:bg-[#d4af37] transition-all shadow-md shadow-primary/10 flex items-center gap-2 cursor-pointer disabled:opacity-40"
                >
                  {savingStandings ? "SAVING..." : "SAVE & PUBLISH"}
                </button>
              </div>
            </div>

            {loadingStandings ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : standingsRows.length === 0 ? (
              <div className="bg-surface-container-low border border-outline-variant/10 p-12 text-center rounded-2xl text-zinc-500 italic text-sm">
                Choose a tournament event to build its standings dashboard.
              </div>
            ) : (
              <div className="bg-surface-container-low border border-outline-variant/10 rounded-2xl overflow-hidden shadow-sm p-6 sm:p-8">
                <p className="text-zinc-500 text-xs mb-4 italic">
                  💡 Type name to activate the row. Blank names are filtered out automatically during publish.
                </p>
                <div className="space-y-4">
                  <div className="grid grid-cols-12 gap-4 text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 px-3">
                    <div className="col-span-1">Rank</div>
                    <div className="col-span-3">Full Name</div>
                    <div className="col-span-2">Roll Number</div>
                    <div className="col-span-2">Score</div>
                    <div className="col-span-2">Tiebreak 1 (e.g. BH)</div>
                    <div className="col-span-2">Tiebreak 2 (e.g. SB)</div>
                  </div>

                  <div className="space-y-3">
                    {standingsRows.map((row, index) => (
                      <div key={index} className="grid grid-cols-12 gap-4 items-center bg-surface-container/30 border border-outline-variant/5 hover:border-outline-variant/15 p-2 rounded-xl transition-colors">
                        <div className="col-span-1">
                          <input
                            type="text"
                            value={row.rank}
                            onChange={(e) => handleRowChange(index, 'rank', e.target.value)}
                            className="w-full text-center p-2 bg-[#111111] rounded border border-gray-800 text-xs focus:border-yellow-400 focus:outline-none"
                          />
                        </div>
                        <div className="col-span-3">
                          <input
                            type="text"
                            placeholder="Player Name"
                            value={row.name}
                            onChange={(e) => handleRowChange(index, 'name', e.target.value)}
                            className="w-full p-2 bg-[#111111] rounded border border-gray-800 text-xs focus:border-yellow-400 focus:outline-none"
                          />
                        </div>
                        <div className="col-span-2">
                          <input
                            type="text"
                            placeholder="Roll No"
                            value={row.roll_no}
                            onChange={(e) => handleRowChange(index, 'roll_no', e.target.value)}
                            className="w-full p-2 bg-[#111111] rounded border border-gray-800 text-xs focus:border-yellow-400 focus:outline-none"
                          />
                        </div>
                        <div className="col-span-2">
                          <input
                            type="text"
                            placeholder="Score"
                            value={row.score}
                            onChange={(e) => handleRowChange(index, 'score', e.target.value)}
                            className="w-full p-2 bg-[#111111] rounded border border-gray-800 text-xs focus:border-yellow-400 focus:outline-none text-primary font-bold"
                          />
                        </div>
                        <div className="col-span-2">
                          <input
                            type="text"
                            placeholder="BH"
                            value={row.tb1}
                            onChange={(e) => handleRowChange(index, 'tb1', e.target.value)}
                            className="w-full p-2 bg-[#111111] rounded border border-gray-800 text-xs focus:border-yellow-400 focus:outline-none"
                          />
                        </div>
                        <div className="col-span-2 flex items-center gap-3">
                          <input
                            type="text"
                            placeholder="SB"
                            value={row.tb2}
                            onChange={(e) => handleRowChange(index, 'tb2', e.target.value)}
                            className="w-full p-2 bg-[#111111] rounded border border-gray-800 text-xs focus:border-yellow-400 focus:outline-none flex-1"
                          />
                          <button
                            onClick={() => handleRemoveStandingsRow(index)}
                            className="w-8 h-8 rounded-lg bg-red-950/20 text-red-500 border border-red-950/40 hover:bg-red-900/30 flex items-center justify-center transition-colors shrink-0"
                            title="Delete Row"
                          >
                            <span className="material-symbols-outlined text-[16px]">delete</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- TAB CONTENT: MEMBERS DIRECTORY --- */}
        {activeTab === 'members' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-outline-variant/15 pb-4">
              <h2 className="text-xl font-serif font-bold">Registered Members Directory</h2>
              {/* Search Bar */}
              <input
                type="text"
                placeholder="Search by Name, Roll No, or Email..."
                value={userSearchQuery}
                onChange={(e) => setUserSearchQuery(e.target.value)}
                className="w-full sm:max-w-md p-2.5 bg-[#111111] rounded-md border border-gray-800 focus:border-yellow-400 focus:outline-none text-xs text-gray-200"
              />
            </div>

            {loadingUsers ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="bg-surface-container-low border border-outline-variant/10 p-12 text-center rounded-2xl text-zinc-500 italic text-sm">
                No users matched your search criteria.
              </div>
            ) : (
              <div className="bg-surface-container-low border border-outline-variant/10 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-outline-variant/10 text-left text-xs">
                    <thead className="bg-[#151515] text-zinc-400 uppercase font-mono text-[10px] tracking-wider font-bold">
                      <tr>
                        <th className="px-6 py-4">User</th>
                        <th className="px-6 py-4">Roll Number</th>
                        <th className="px-6 py-4">Chess.com Username</th>
                        <th className="px-6 py-4">Contact</th>
                        <th className="px-6 py-4">Gender</th>
                        <th className="px-6 py-4">Admin Status</th>
                        <th className="px-6 py-4">Joined At</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/5 text-zinc-300">
                      {filteredUsers.map((u) => (
                        <tr key={u.id} className="hover:bg-surface-container-high/40 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-semibold text-white">{u.name}</div>
                            <div className="text-zinc-500 text-[11px] font-mono">{u.email}</div>
                          </td>
                          <td className="px-6 py-4 font-mono">{u.roll_no || 'TBD'}</td>
                          <td className="px-6 py-4 text-primary">{u.chess_username || 'None'}</td>
                          <td className="px-6 py-4 font-mono text-zinc-400">{u.contact || 'None'}</td>
                          <td className="px-6 py-4">{u.gender || 'Male'}</td>
                          <td className="px-6 py-4">
                            {u.is_admin ? (
                              <span className="px-2 py-0.5 bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 text-[9px] rounded font-mono uppercase font-bold tracking-wider">
                                ADMIN ✓
                              </span>
                            ) : (
                              <span className="text-zinc-500 text-[10px]">Standard</span>
                            )}
                          </td>
                          <td className="px-6 py-4 font-mono text-zinc-500">
                            {new Date(u.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
      <Footer />
    </div>
  );
};

export default AdminPortal;
