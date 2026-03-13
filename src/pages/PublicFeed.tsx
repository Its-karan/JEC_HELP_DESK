import Header from '@/components/Header';
import ComplaintCard from '@/components/ComplaintCard';
import { useComplaints } from '@/context/ComplaintContext';
import { Search } from 'lucide-react';
import { useState } from 'react';

export default function PublicFeed() {
  const { complaints, stats } = useComplaints();
  const [search, setSearch] = useState('');

  const filtered = complaints.filter(c =>
    c.studentName.toLowerCase().includes(search.toLowerCase()) ||
    c.tokenId.toLowerCase().includes(search.toLowerCase()) ||
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Total Issues', value: stats.total },
            { label: 'Resolved', value: stats.solved },
            { label: 'Avg Resolution', value: stats.avgResolutionTime },
          ].map(s => (
            <div key={s.label} className="jec-card p-4 animate-fade-in border-l-2 border-l-[#ffc61a]">
              <p className="text-xs text-slate-500">{s.label}</p>
              <p className="text-2xl font-bold text-[#b91c1c] mt-1">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="jec-card p-6 border-l-4 border-l-[#ffc61a]">
          <h2 className="text-xl font-bold text-[#b91c1c] mb-1">Public Accountability Feed</h2>
          <p className="text-sm text-slate-500 mb-4">Transparent tracking of all student grievances.</p>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by Student Name or Token ID"
              className="w-full border rounded-lg pl-9 pr-3 py-2.5 text-sm bg-card focus:ring-2 focus:ring-[#ffc61a]/30 focus:border-[#ffc61a] outline-none" />
          </div>

          <div className="space-y-4">
            {filtered.map(c => <ComplaintCard key={c.id} complaint={c} />)}
            {filtered.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No complaints found.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
