import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Complaint, AdminComment } from '@/types';
import { supabase } from '@/lib/supabase';

interface ComplaintContextType {
  complaints: Complaint[];
  addComplaint: (c: Omit<Complaint, 'id' | 'tokenId' | 'createdAt' | 'adminComments' | 'authorityLevel' | 'status'>) => Promise<void>;
  escalate: (id: string) => Promise<void>;
  markSolved: (id: string, proofUrl?: string) => Promise<void>;
  addComment: (complaintId: string, comment: Omit<AdminComment, 'id' | 'timestamp'>) => Promise<void>;
  setExpectedDate: (id: string, date: string) => Promise<void>;
  stats: { total: number; solved: number; avgResolutionTime: string };
  loading: boolean;
}

const ComplaintContext = createContext<ComplaintContextType | undefined>(undefined);

export function ComplaintProvider({ children }: { children: ReactNode }) {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  const mapGrievance = (db: any): Complaint => ({
    id: db.id,
    tokenId: db.token_id,
    title: db.title,
    description: db.description,
    category: db.category,
    subCategory: db.sub_category,
    targetDepartment: db.target_department,
    branch: db.branch,
    degree: db.degree,
    studentId: db.student_id,
    studentName: db.student_name,
    urgency: db.urgency,
    status: db.status,
    authorityLevel: db.authority_level,
    expectedDate: db.expected_date,
    resolvedAt: db.resolved_at,
    resolutionProofUrl: db.resolution_proof_url,
    createdAt: db.created_at,
    adminComments: (db.adminComments || []).map((cm: any) => ({
      id: cm.id,
      authorId: cm.author_id,
      authorName: cm.author_name,
      text: cm.content,
      timestamp: cm.timestamp
    }))
  });

  const fetchComplaints = async () => {
    try {
      const { data, error } = await supabase
        .from('grievances')
        .select('*, adminComments:comments(*)');
      
      if (!error && data && data.length > 0) {
        const mapped = data.map(mapGrievance);
        setComplaints(mapped);
        localStorage.setItem('jec_grievances', JSON.stringify(mapped)); // Sync local with DB
      } else {
        // FALLBACK: Load from localStorage if DB is empty or fails
        console.warn("Supabase empty or error, falling back to localStorage", error);
        const saved = localStorage.getItem('jec_grievances');
        if (saved) setComplaints(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Fetch error:", e);
      const saved = localStorage.getItem('jec_grievances');
      if (saved) setComplaints(JSON.parse(saved));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchComplaints();

    // Set up real-time subscription
    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'grievances' }, fetchComplaints)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'comments' }, fetchComplaints)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const addComplaint = async (c: any) => {
    const { data: lastId } = await supabase.from('grievances').select('token_id').order('created_at', { ascending: false }).limit(1);
    const idNum = lastId?.[0] ? parseInt(lastId[0].token_id.split('-').pop()) + 1 : 1;
    const tokenId = `JEC-2026-${String(idNum).padStart(4, '0')}`;

    const newGrievance: Complaint = {
      ...c,
      id: crypto.randomUUID(),
      tokenId,
      status: 'pending',
      authorityLevel: 1,
      createdAt: new Date().toISOString(),
      adminComments: []
    };

    // DUAL-WRITE: Always save to localStorage first
    const saved = localStorage.getItem('jec_grievances');
    const existing = saved ? JSON.parse(saved) : [];
    localStorage.setItem('jec_grievances', JSON.stringify([...existing, newGrievance]));
    setComplaints(prev => [...prev, newGrievance]);

    // ASYNC DB ATTEMPT
    try {
      const { error } = await supabase.from('grievances').insert([{
        token_id: tokenId,
        student_id: String(c.studentId),
        student_name: c.studentName || 'Student',
        title: c.title,
        description: c.description,
        category: c.category,
        sub_category: c.subCategory,
        target_department: c.targetDepartment,
        branch: c.branch,
        degree: c.degree,
        urgency: c.urgency,
        status: 'pending',
        authority_level: 1,
      }]);
      if (error) console.error("Supabase insert error:", error);
    } catch (e) {
      console.error("Supabase crash:", e);
    }
  };

  const updateLocal = (id: string, updates: Partial<Complaint>) => {
    setComplaints(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    const saved = localStorage.getItem('jec_grievances');
    if (saved) {
      const all = JSON.parse(saved);
      localStorage.setItem('jec_grievances', JSON.stringify(
        all.map((item: any) => item.id === id ? { ...item, ...updates } : item)
      ));
    }
  };

  const escalate = async (id: string) => {
    const complaint = complaints.find(c => c.id === id);
    if (!complaint) return;
    const newLevel = complaint.authorityLevel + 1;
    
    updateLocal(id, { authorityLevel: newLevel });

    try {
      await supabase.from('grievances').update({ authority_level: newLevel }).eq('token_id', complaint.tokenId);
    } catch (e) { console.error("Escalation DB error:", e); }
  };

  const markSolved = async (id: string, proofUrl?: string) => {
    const complaint = complaints.find(c => c.id === id);
    if (!complaint) return;

    const updates = { status: 'resolved' as const, resolvedAt: new Date().toISOString(), resolutionProofUrl: proofUrl };
    updateLocal(id, updates);

    try {
      await supabase.from('grievances').update({ 
        status: 'resolved', 
        resolved_at: updates.resolvedAt, 
        resolution_proof_url: proofUrl 
      }).eq('token_id', complaint.tokenId);
    } catch (e) { console.error("Resolve DB error:", e); }
  };

  const addComment = async (complaintId: string, comment: any) => {
    // Basic local sync for comments is harder due to nested arrays, but we'll try
    const complaint = complaints.find(c => c.id === complaintId);
    if (complaint) {
      const newComment = {
        id: crypto.randomUUID(),
        authorId: comment.authorId,
        authorName: comment.authorName,
        text: comment.text,
        timestamp: new Date().toISOString()
      };
      updateLocal(complaintId, { adminComments: [...complaint.adminComments, newComment] });
    }

    try {
      await supabase.from('comments').insert([{
        grievance_id: complaintId, // TokenId check might be needed if UUIDs mismatch
        author_id: String(comment.authorId),
        author_name: comment.authorName,
        content: comment.text,
      }]);
    } catch (e) { console.error("Comment DB error:", e); }
  };

  const setExpectedDate = async (id: string, date: string) => {
    const complaint = complaints.find(c => c.id === id);
    if (!complaint) return;

    updateLocal(id, { expectedDate: date, status: 'in-progress' });

    try {
      await supabase
        .from('grievances')
        .update({ 
          expected_date: date, 
          status: 'in-progress' 
        })
        .eq('token_id', complaint.tokenId);
    } catch (e) { console.error("ExpectedDate DB error:", e); }
  };

  const solved = complaints.filter(c => c.status === 'resolved');
  const stats = {
    total: complaints.length,
    solved: solved.length,
    avgResolutionTime: solved.length > 0
      ? (() => {
          const avgMs = solved.reduce((sum, c) => sum + (new Date(c.resolvedAt!).getTime() - new Date(c.createdAt).getTime()), 0) / solved.length;
          const days = Math.round(avgMs / (1000 * 60 * 60 * 24));
          return days > 0 ? `${days} day${days > 1 ? 's' : ''}` : '< 1 day';
        })()
      : '—',
  };

  return (
    <ComplaintContext.Provider value={{ complaints, addComplaint, escalate, markSolved, addComment, setExpectedDate, stats, loading }}>
      {children}
    </ComplaintContext.Provider>
  );
}

export function useComplaints() {
  const ctx = useContext(ComplaintContext);
  if (!ctx) throw new Error('useComplaints must be inside ComplaintProvider');
  return ctx;
}
