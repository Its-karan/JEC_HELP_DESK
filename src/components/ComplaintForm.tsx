import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useComplaints } from '@/context/ComplaintContext';
import { DEGREE_PROGRAMS, DEGREE_BRANCHES, DEPARTMENTS, CATEGORIES, SUB_CATEGORIES, URGENT_SUB_CATEGORIES, UrgencyLevel, ComplaintCategory, DegreeProgram } from '@/types';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, X } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ComplaintForm() {
  const { user } = useAuth();
  const { addComplaint } = useComplaints();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ComplaintCategory | ''>('');
  const [subCategory, setSubCategory] = useState('');
  const [degree, setDegree] = useState<DegreeProgram | ''>(user?.degree || '');
  const [branch, setBranch] = useState(user?.branch || '');
  const [department, setDepartment] = useState('');
  const [urgency, setUrgency] = useState<UrgencyLevel>('Low');
  const [submitted, setSubmitted] = useState(false);
  const [branchAnimating, setBranchAnimating] = useState(false);
  const [showReviewDrawer, setShowReviewDrawer] = useState(false);

  // Auto-set department based on category
  useEffect(() => {
    if (category) {
      setDepartment(category);
    }
  }, [category]);

  // Auto-urgency for critical sub-categories
  useEffect(() => {
    if (subCategory && URGENT_SUB_CATEGORIES.includes(subCategory)) {
      setUrgency('High');
    }
  }, [subCategory]);

  if (!user) return null;

  const availableBranches = degree ? DEGREE_BRANCHES[degree] : [];
  const availableSubCategories = category ? SUB_CATEGORIES[category] : [];

  // Animate branch dropdown on degree change
  const handleDegreeChange = (val: string) => {
    setDegree(val as DegreeProgram | '');
    setBranch('');
    setBranchAnimating(true);
    setTimeout(() => setBranchAnimating(false), 400);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !category || !branch || !department) return;
    setShowReviewDrawer(true);
  };

  const confirmAndSubmit = () => {
    const newGrievance = {
      title,
      description,
      category: category as ComplaintCategory,
      subCategory: subCategory || undefined,
      targetDepartment: department,
      branch,
      degree: degree as DegreeProgram || undefined,
      studentId: user.id,
      studentName: user.name,
      urgency,
      imageUrl: undefined,
      resolutionProofUrl: undefined,
      expectedDate: undefined,
      resolvedAt: undefined,
      status: 'pending',
      authorityLevel: 1,
      adminComments: [],
      createdAt: new Date().toISOString(),
      id: String(Date.now()),
      tokenId: `JEC-2026-${String(Date.now()).slice(-4)}`
    };

    // Also update context if possible (optional but good for UI reactivity)
    addComplaint(newGrievance);

    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 }
    });

    setTitle(''); setDescription(''); setCategory(''); setSubCategory(''); setDepartment(''); setUrgency('Low');
    setShowReviewDrawer(false);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="jec-card p-6 border-l-4 border-l-[#ffc61a]">
      <h2 className="text-xl font-bold text-[#b91c1c] mb-1">Raise Complaint</h2>
      <p className="text-sm text-slate-500 mb-5">Submit a formal request to the concerned department for prompt resolution.</p>

      {submitted && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4 animate-scale-in text-center">
          <p className="text-green-700 font-semibold text-lg">✅ Complaint Submitted Successfully!</p>
          <p className="text-sm text-slate-500">Your complaint has been logged and assigned to Level 1.</p>
        </div>
      )}

      {/* Review Drawer */}
      <AnimatePresence>
        {showReviewDrawer && (
          <div className="fixed inset-0 z-[100] flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowReviewDrawer(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm cursor-pointer"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-slate-200"
            >
              <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50">
                <h2 className="text-xl font-bold text-[#b91c1c]">Review Your Grievance</h2>
                <button
                  onClick={() => setShowReviewDrawer(false)}
                  className="p-2 rounded-full hover:bg-slate-200 transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="space-y-4">
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                    <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Title</p>
                    <p className="font-medium text-slate-900">{title}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                      <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Category</p>
                      <p className="font-medium text-slate-900">{category}</p>
                    </div>
                    {subCategory && (
                      <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                        <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Sub-Category</p>
                        <p className="font-medium text-slate-900">{subCategory}</p>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                      <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Branch</p>
                      <p className="font-medium text-slate-900">{branch}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                      <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Priority Level</p>
                      <p className={`font-semibold ${
                        urgency === 'High' ? 'text-red-600' : 
                        urgency === 'Medium' ? 'text-amber-500' : 'text-green-600'
                      }`}>{urgency}</p>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                    <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Routed To</p>
                    <p className="font-medium text-slate-900">{department}</p>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                    <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Description</p>
                    <p className="text-sm text-slate-700 whitespace-pre-wrap">{description}</p>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-slate-100 bg-white/95 backdrop-blur flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowReviewDrawer(false)}
                  className="flex-1 py-3 rounded-lg font-semibold border-2 border-slate-100 hover:bg-slate-50 transition-colors text-slate-600"
                >
                  Edit Details
                </button>
                <button
                  type="button"
                  onClick={confirmAndSubmit}
                  className="flex-1 bg-[#ffc61a] hover:bg-[#e6b10a] text-black py-3 rounded-lg font-bold shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  Confirm & Submit
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">Title</label>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Brief title of your issue"
            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:ring-2 focus:ring-[#ffc61a]/30 focus:border-[#ffc61a] outline-none transition-all" required />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">Full Name</label>
          <input value={user.name} disabled className="w-full border border-slate-100 rounded-lg px-3 py-2.5 text-sm bg-slate-50 text-slate-500 cursor-not-allowed" />
        </div>

        {/* Two-tier Degree → Branch */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Degree Program</label>
            <select value={degree} onChange={e => handleDegreeChange(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:ring-2 focus:ring-[#ffc61a]/30 focus:border-[#ffc61a] outline-none transition-all" required>
              <option value="">Select Degree</option>
              {DEGREE_PROGRAMS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Branch / Department</label>
            <select value={branch} onChange={e => setBranch(e.target.value)}
              disabled={!degree}
              className={`w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none transition-all duration-300 ${
                !degree ? 'bg-slate-50 cursor-not-allowed opacity-60' : 'bg-white focus:ring-2 focus:ring-[#ffc61a]/30 focus:border-[#ffc61a]'
              } ${branchAnimating ? 'animate-fade-in' : ''}`}
              required>
              <option value="">{degree ? 'Select Branch' : 'Select Degree first'}</option>
              {availableBranches.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Category</label>
            <select value={category} onChange={e => { setCategory(e.target.value as ComplaintCategory | ''); setSubCategory(''); }}
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:ring-2 focus:ring-[#ffc61a]/30 focus:border-[#ffc61a] outline-none transition-all" required>
              <option value="">Select category</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Sub-Category</label>
            <select value={subCategory} onChange={e => setSubCategory(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:ring-2 focus:ring-[#ffc61a]/30 focus:border-[#ffc61a] outline-none" disabled={!category}>
              <option value="">Select sub-category</option>
              {availableSubCategories.map(sc => <option key={sc} value={sc}>{sc}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Routed To (Auto)</label>
            <input value={department || '—'} disabled
              className="w-full border border-slate-100 rounded-lg px-3 py-2.5 text-sm bg-slate-50 text-slate-500 cursor-not-allowed" />
            <p className="text-[10px] text-slate-400 mt-0.5">Auto-assigned based on category selection.</p>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Urgency Level</label>
            <select value={urgency} onChange={e => setUrgency(e.target.value as UrgencyLevel)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:ring-2 focus:ring-[#d4af37]/30 outline-none">
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
            {subCategory && URGENT_SUB_CATEGORIES.includes(subCategory) && (
              <p className="text-[10px] text-red-600 font-bold mt-0.5 animate-pulse">⚠ Auto-marked HIGH due to critical sub-category.</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">Query Description</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4}
            placeholder="Describe the issue in detail"
            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm bg-white resize-y focus:ring-2 focus:ring-[#ffc61a]/30 focus:border-[#ffc61a] outline-none transition-all" required />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">Upload Image</label>
          <input type="file" accept="image/*" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white" />
          <p className="text-xs text-slate-400 mt-1">Optional: Upload a photo as proof of the issue.</p>
        </div>
        <button type="submit" className="w-full bg-[#ffc61a] hover:bg-[#e6b10a] text-black py-3 rounded-lg font-bold shadow-md hover:shadow-lg transition-all transform active:scale-[0.98]">
          Submit to Level 1 (Assigned Employee)
        </button>
        <div className="bg-slate-50 rounded-lg p-3 border-l-4 border-[#ffc61a]">
          <p className="text-xs text-slate-600"><span className="font-bold text-slate-800">Reference Desk:</span> Keep your submission factual and concise for faster processing.</p>
        </div>
      </form>
    </div>
  );
}
