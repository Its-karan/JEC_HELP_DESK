import Header from '@/components/Header';
import ComplaintCard from '@/components/ComplaintCard';
import { useAuth } from '@/context/AuthContext';
import { useComplaints } from '@/context/ComplaintContext';
import { Navigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { DEGREE_PROGRAMS, URGENT_SUB_CATEGORIES, DegreeProgram } from '@/types';

export default function AuthorityDashboard() {
  const { user } = useAuth();
  const { complaints, stats } = useComplaints();
  const [search, setSearch] = useState('');
  const [degreeFilter, setDegreeFilter] = useState<DegreeProgram | ''>('');
  if (!user || user.role === 'student') return <Navigate to="/login" />;

  // Filter complaints relevant to this authority
  const relevantComplaints = complaints.filter(c => {
    const level = Number(c.authorityLevel);
    const dept = user.department;

    if (dept === 'Department Head') {
      return level === 2;
    }
    if (dept === 'Branch HOD') {
      return level === 3;
    }
    if (dept === 'Principal / Apex Authority') {
      return level === 4;
    }
    
    // Level 1 Authorities (IT, Hostel, etc.)
    return c.targetDepartment === dept && (level === 1 || !level);
  });

  const filtered = relevantComplaints.filter(c => {
    const matchesSearch = c.studentName.toLowerCase().includes(search.toLowerCase()) ||
      c.tokenId.toLowerCase().includes(search.toLowerCase()) ||
      c.title.toLowerCase().includes(search.toLowerCase());
    const matchesDegree = !degreeFilter || c.degree === degreeFilter;
    return matchesSearch && matchesDegree;
  });

  const pending = filtered.filter(c => c.status !== 'resolved');
  const resolved = filtered.filter(c => c.status === 'resolved');

  // Sort: auto-urgent pinned to top, then by urgency
  const sortedPending = [...pending].sort((a, b) => {
    const aAutoUrgent = a.subCategory && URGENT_SUB_CATEGORIES.includes(a.subCategory) ? 0 : 1;
    const bAutoUrgent = b.subCategory && URGENT_SUB_CATEGORIES.includes(b.subCategory) ? 0 : 1;
    if (aAutoUrgent !== bAutoUrgent) return aAutoUrgent - bAutoUrgent;
    const urgencyOrder = { High: 0, Medium: 1, Low: 2 };
    return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Assigned to You', value: relevantComplaints.length },
            { label: 'Pending', value: relevantComplaints.filter(c => c.status !== 'resolved').length },
            { label: 'Resolved', value: relevantComplaints.filter(c => c.status === 'resolved').length },
          ].map(s => (
            <div key={s.label} className="jec-card p-4 animate-fade-in border-l-2 border-l-[#ffc61a]">
              <p className="text-xs text-slate-500">{s.label}</p>
              <p className="text-2xl font-bold text-[#b91c1c] mt-1">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="jec-card p-6 mb-6 border-l-4 border-l-[#ffc61a]">
          <h2 className="text-xl font-bold text-[#b91c1c] mb-1">Authority Task Inbox</h2>
          <p className="text-sm text-slate-600 mb-4">
            Welcome, <strong className="text-slate-900">{user.name}</strong> ({user.role}
            {user.department ? ` — ${user.department}` : ''}).
            Manage and respond to student grievances below.
          </p>

          <div className="flex gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search complaints..."
                className="w-full border border-slate-200 rounded-lg pl-9 pr-3 py-2.5 text-sm bg-white focus:ring-2 focus:ring-[#ffc61a]/30 focus:border-[#ffc61a] outline-none transition-all" />
            </div>
            <select value={degreeFilter} onChange={e => setDegreeFilter(e.target.value as DegreeProgram | '')}
              className="border border-slate-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:ring-2 focus:ring-[#ffc61a] outline-none min-w-[140px] text-slate-700">
              <option value="">All Degrees</option>
              {DEGREE_PROGRAMS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            Pending ({sortedPending.length})
          </h3>
          <div className="space-y-4 mb-8">
            {sortedPending.map(c => <ComplaintCard key={c.id} complaint={c} />)}
            {sortedPending.length === 0 && <p className="text-sm text-slate-400 text-center py-6 border-2 border-dashed border-slate-100 rounded-xl">No pending complaints 🎉</p>}
          </div>

          {resolved.length > 0 && (
            <>
              <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                Resolved ({resolved.length})
              </h3>
              <div className="space-y-4">
                {resolved.map(c => <ComplaintCard key={c.id} complaint={c} showActions={false} />)}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
