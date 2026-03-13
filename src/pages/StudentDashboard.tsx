import Header from '@/components/Header';
import ComplaintForm from '@/components/ComplaintForm';
import ComplaintCard from '@/components/ComplaintCard';
import { useAuth } from '@/context/AuthContext';
import { useComplaints } from '@/context/ComplaintContext';
import { Navigate } from 'react-router-dom';
import { ESCALATION_LABELS } from '@/types';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function StudentDashboard() {
  const { user } = useAuth();
  const { complaints, stats } = useComplaints();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'personal' | 'public'>('personal');

  if (!user || user.role !== 'student') return <Navigate to="/login" />;

  const myComplaints = complaints.filter(c => c.studentId === user.id);
  const feedComplaints = complaints.filter(c =>
    c.studentId !== user.id && (
      c.studentName.toLowerCase().includes(search.toLowerCase()) ||
      c.tokenId.toLowerCase().includes(search.toLowerCase()) ||
      c.title.toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div className="container mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Total Issues Raised', value: stats.total },
            { label: 'Issues Solved', value: stats.solved },
            { label: 'Average Resolution Time', value: stats.avgResolutionTime },
          ].map(s => (
            <div key={s.label} className="jec-card p-4 animate-fade-in border-l-2 border-l-[#ffc61a]">
              <p className="text-xs text-slate-500">{s.label}</p>
              <p className="text-2xl font-bold text-[#b91c1c] mt-1">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Info panel */}
        <div className="jec-card p-6 mb-6 animate-fade-in border-l-4 border-l-[#ffc61a]">
          <h2 className="text-xl font-bold text-[#b91c1c] mb-2">Student Help Dashboard</h2>
          <p className="text-sm text-slate-600 mb-4">This platform is built to eliminate the physical struggles students face. Now, get direct resolutions to your problems from the comfort of your room.</p>
          <h3 className="font-semibold text-slate-800 mb-2">Escalation Logic (Cumulative)</h3>
          <ol className="list-decimal list-inside text-sm text-slate-700 space-y-1 mb-4">
            {Object.entries(ESCALATION_LABELS).map(([level, label]) => (
              <li key={level}><strong>Level {level}:</strong> {label}.</li>
            ))}
          </ol>
          <div className="bg-slate-100/80 rounded-lg p-3 text-sm text-slate-600 border border-slate-200/50 italic">All submissions appear in the public feed with their current authority level.</div>
        </div>

        {/* Main content - Tabbed Interface */}
        <div className="mb-6 flex space-x-2 bg-slate-200/50 p-1.5 rounded-xl backdrop-blur-md w-fit border border-slate-300/30 shadow-inner">
          <button
            onClick={() => setActiveTab('personal')}
            className={`relative px-6 py-2.5 rounded-lg text-sm transition-all duration-300 ${
              activeTab === 'personal' ? 'text-black font-bold shadow-sm' : 'text-slate-600 hover:bg-white/50 hover:text-slate-900'
            }`}
          >
            {activeTab === 'personal' && (
              <motion.div
                layoutId="active-tab"
                className="absolute inset-0 bg-[#ffc61a] rounded-lg shadow-md"
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              />
            )}
            <span className="relative z-10 flex items-center justify-center gap-2">
              My Grievances
              <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeTab === 'personal' ? 'bg-black/20' : 'bg-slate-300 text-slate-700'}`}>{myComplaints.length}</span>
            </span>
          </button>
          
          <button
            onClick={() => setActiveTab('public')}
            className={`relative px-6 py-2.5 rounded-lg text-sm transition-all duration-300 ${
              activeTab === 'public' ? 'text-black font-bold shadow-sm' : 'text-slate-600 hover:bg-white/50 hover:text-slate-900'
            }`}
          >
            {activeTab === 'public' && (
              <motion.div
                layoutId="active-tab"
                className="absolute inset-0 bg-[#ffc61a] rounded-lg shadow-md"
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              />
            )}
            <span className="relative z-10 flex items-center justify-center gap-2">
              Public Campus Feed
              <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeTab === 'public' ? 'bg-black/20' : 'bg-slate-300 text-slate-700'}`}>{feedComplaints.length}</span>
            </span>
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <ComplaintForm />
          
          <AnimatePresence mode="wait">
            {activeTab === 'personal' ? (
              <motion.div
                key="personal"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <div className="jec-card p-6 border-l-4 border-l-[#ffc61a]">
                  <h2 className="text-xl font-bold text-[#b91c1c] mb-1">My Grievances</h2>
                  <p className="text-sm text-slate-500 mb-4">Track the exact status of your personal submissions.</p>
                  
                  <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                    {myComplaints.map(c => <ComplaintCard key={c.id} complaint={c} showActions={true} />)}
                    {myComplaints.length === 0 && <p className="text-sm text-slate-400 text-center py-8">You haven't submitted any complaints yet.</p>}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="public"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <div className="jec-card p-6 border-l-4 border-l-[#ffc61a]">
                  <h2 className="text-xl font-bold text-[#b91c1c] mb-1">Public Accountability Feed</h2>
                  <p className="text-sm text-slate-500 mb-4">Live status of overall campus grievances (Read-Only).</p>
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input value={search} onChange={e => setSearch(e.target.value)}
                      placeholder="Search by Student Name or Token ID"
                      className="w-full border border-slate-200 rounded-lg pl-9 pr-3 py-2.5 text-sm bg-white focus:ring-2 focus:ring-[#ffc61a]/30 focus:border-[#ffc61a] outline-none transition-all" />
                  </div>
                  <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                    {feedComplaints.map(c => <ComplaintCard key={c.id} complaint={c} showActions={false} isPublicFeed={true} />)}
                    {feedComplaints.length === 0 && <p className="text-sm text-slate-400 text-center py-8">No public complaints found.</p>}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
