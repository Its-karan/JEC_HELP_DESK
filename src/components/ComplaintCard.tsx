import { Complaint, getAuthoritiesInformed, BRANCH_SHORT, CATEGORY_COLORS, URGENT_SUB_CATEGORIES } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { useComplaints } from '@/context/ComplaintContext';
import { ArrowUpCircle, CheckCircle, Lock, Calendar, MessageSquare, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

interface Props {
  complaint: Complaint;
  showActions?: boolean;
  isPublicFeed?: boolean;
}

export default function ComplaintCard({ complaint, showActions = true, isPublicFeed = false }: Props) {
  const { user } = useAuth();
  const { escalate, markSolved, addComment, setExpectedDate } = useComplaints();
  const [commentText, setCommentText] = useState('');
  const [dateValue, setDateValue] = useState(complaint.expectedDate || '');
  const [showComments, setShowComments] = useState(false);

  const c = complaint;
  const isOwner = user?.id === c.studentId;
  const isAuthority = user && (user.role === 'employee' || user.role === 'hod' || user.role === 'principal');
  const isResolved = c.status === 'resolved';
  const progress = c.authorityLevel * 25;
  const isOverdue = c.expectedDate && new Date(c.expectedDate) < new Date() && !isResolved;
  const branchShort = BRANCH_SHORT[c.branch] || c.branch;
  const isAutoUrgent = c.subCategory && URGENT_SUB_CATEGORIES.includes(c.subCategory);
  const catColor = CATEGORY_COLORS[c.category] || { bg: 'bg-muted', text: 'text-muted-foreground' };

  const levelLabel = (() => {
    if (isResolved) return 'RESOLVED SUCCESSFULLY';
    switch (c.authorityLevel) {
      case 1: return 'LEVEL 1 • ASSIGNED EMPLOYEE';
      case 2: return 'LEVEL 2 • HEAD OF DEPT';
      case 3: return 'LEVEL 3 • BRANCH HOD';
      case 4: return 'LEVEL 4 • PRINCIPAL';
      default: return '';
    }
  })();

  const badgeClass = isResolved ? 'jec-badge-success' : c.authorityLevel >= 3 ? 'jec-badge-danger' : c.authorityLevel === 2 ? 'jec-badge-warning' : 'jec-badge-info';

  return (
    <div className={`jec-card border-l-4 border-l-[#ffc61a] p-5 animate-fade-in ${isOverdue ? 'glow-red' : ''}`}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1">
          <h3 className="font-bold text-[#b91c1c] leading-snug">{!isPublicFeed ? c.title : `${c.category} Issue Reported`}</h3>
          <div className="flex flex-wrap items-center gap-2 mt-1.5">
            {/* Category color tag */}
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${catColor.bg} ${catColor.text}`}>
              {c.category}
            </span>
            {!isPublicFeed && c.degree && (
              <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium bg-slate-100 text-slate-600">
                {c.degree}
              </span>
            )}
            {/* Flashing URGENT badge */}
            {isAutoUrgent && !isResolved && !isPublicFeed && (
              <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold bg-red-600 text-white animate-pulse">
                <AlertTriangle className="w-3 h-3" /> URGENT
              </span>
            )}
          </div>
        </div>
        <span className={`${badgeClass}`}>{levelLabel}</span>
      </div>

      {!isPublicFeed ? (
        <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm mb-3 text-slate-700">
          <p><span className="font-semibold text-slate-900">Token ID:</span> {c.tokenId}</p>
          <p><span className="font-semibold text-slate-900">Student:</span> {c.studentName}</p>
          <p><span className="font-semibold text-slate-900">Branch:</span> {branchShort}</p>
          <p><span className="font-semibold text-slate-900">Target Dept:</span> {c.targetDepartment}</p>
          <p><span className="font-semibold text-slate-900">Category:</span> {c.category}{c.subCategory ? ` → ${c.subCategory}` : ''}</p>
          <p><span className="font-semibold text-slate-900">Urgency:</span> <span className={c.urgency === 'High' ? 'text-red-600 font-bold' : ''}>{c.urgency}</span></p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm mb-3 text-slate-500">
          <p><span className="font-semibold text-slate-700">Target Dept:</span> {c.targetDepartment}</p>
          <p><span className="font-semibold text-slate-700">Status:</span> {isResolved ? 'Resolved' : 'Pending'}</p>
          <p><span className="font-semibold text-slate-700">Date:</span> {new Date(c.createdAt).toLocaleDateString()}</p>
        </div>
      )}

      {!isPublicFeed && (
        <div className="bg-slate-50 border border-slate-100 rounded-md px-3 py-2 text-sm mb-3 text-slate-600">
          <span className="font-semibold text-slate-800">Authorities Informed:</span> {getAuthoritiesInformed(c.authorityLevel, c.targetDepartment, c.branch)}
        </div>
      )}

      {/* Escalation Progress */}
      <div className="mb-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Escalation Progress</p>
        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${isOverdue ? 'bg-red-600' : isResolved ? 'bg-green-500' : 'bg-[#ffc61a]'}`}
            style={{ width: `${isResolved ? 100 : progress}%` }}
          />
        </div>
        <p className="text-xs text-slate-500 mt-1">{isResolved ? 'Resolved' : `${progress}% to Principal`}</p>
      </div>

      {c.expectedDate && !isPublicFeed && (
        <p className={`text-xs mb-2 ${isOverdue ? 'text-red-600 font-semibold' : 'text-slate-500'}`}>
          <Calendar className="w-3 h-3 inline mr-1" />
          Expected by: {new Date(c.expectedDate).toLocaleDateString()}
          {isOverdue && ' ⚠️ OVERDUE'}
        </p>
      )}

      {/* Admin comments */}
      {c.adminComments.length > 0 && !isPublicFeed && (
        <button onClick={() => setShowComments(!showComments)} className="text-xs text-[#b91c1c] font-medium flex items-center gap-1 mb-2 hover:underline">
          <MessageSquare className="w-3 h-3" /> {c.adminComments.length} comment(s)
        </button>
      )}
      {showComments && !isPublicFeed && c.adminComments.map(cm => (
        <div key={cm.id} className="bg-slate-50 border border-slate-100 rounded px-3 py-2 text-xs mb-1">
          <span className="font-semibold text-slate-800">{cm.authorName}:</span> {cm.text}
          <span className="text-slate-400 ml-2">{new Date(cm.timestamp).toLocaleString()}</span>
        </div>
      ))}

      {/* Actions */}
      {showActions && !isResolved && !isPublicFeed && (
        <div className="flex flex-wrap gap-2 mt-3">
          {isOwner && c.authorityLevel < 4 && (
            (() => {
              const isLocked = c.expectedDate && new Date() < new Date(c.expectedDate);

              if (isLocked) {
                return (
                  <button 
                    disabled 
                    className="bg-gray-400 text-white cursor-not-allowed opacity-80 flex items-center gap-2 px-4 py-2 rounded-md"
                  >
                    <Lock className="w-4 h-4" /> Locked till {new Date(c.expectedDate).toLocaleDateString()}
                  </button>
                );
              } else {
                return (
                  <button 
                    onClick={() => escalate(c.id)} 
                    className="bg-red-600 hover:bg-red-700 text-white animate-pulse shadow-[0_0_10px_rgba(220,38,38,0.8)] cursor-pointer flex items-center gap-2 px-4 py-2 rounded-md transition-all"
                  >
                    <ArrowUpCircle className="w-4 h-4" /> Escalate Issue
                  </button>
                );
              }
            })()
          )}
          {isOwner && (
            <button onClick={() => markSolved(c.id)} className="bg-[#ffc61a] hover:bg-[#e6b10a] text-black px-4 py-2 rounded-md text-sm font-medium shadow-md transition-all flex items-center gap-1">
              <CheckCircle className="w-4 h-4" /> Mark as Solved at Level {c.authorityLevel}
            </button>
          )}

          {isAuthority && (
            <>
              <div className="flex items-center gap-2">
                <input type="date" value={dateValue} onChange={e => setDateValue(e.target.value)}
                  className="border border-slate-200 rounded px-2 py-1.5 text-sm bg-white" />
                <button onClick={() => {
                  if (dateValue) {
                    setExpectedDate(c.id, dateValue);
                  }
                }}
                  className="bg-[#ffc61a] hover:bg-[#e6b10a] text-black px-3 py-1.5 rounded text-sm font-medium shadow-sm transition-all">
                  Set SLA Date
                </button>
              </div>
              <div className="flex items-center gap-2 w-full">
                <input value={commentText} onChange={e => setCommentText(e.target.value)}
                  placeholder="Add a comment..."
                  className="border border-slate-200 rounded px-2 py-1.5 text-sm flex-1 bg-white" />
                <button onClick={() => {
                  if (commentText.trim() && user) {
                    addComment(c.id, { authorId: user.id, authorName: user.name, text: commentText });
                    setCommentText('');
                  }
                }} className="bg-[#ffc61a] hover:bg-[#e6b10a] text-black px-3 py-1.5 rounded text-sm font-medium shadow-sm transition-all">
                  Post
                </button>
              </div>
              <button onClick={() => markSolved(c.id)}
                className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 shadow-sm transition-all flex items-center gap-1">
                <CheckCircle className="w-4 h-4" /> Mark Resolved
              </button>
            </>
          )}

          {!isOwner && !isAuthority && !isPublicFeed && (
            <span className="flex items-center gap-1 text-xs text-slate-400">
              <Lock className="w-3 h-3" /> View Only
            </span>
          )}
        </div>
      )}

      {isResolved && (
        <div className="mt-3">
          <span className="bg-green-100 text-green-800 border border-green-200 px-4 py-2 rounded-md text-sm font-medium inline-flex items-center gap-1">
            <CheckCircle className="w-4 h-4" /> Marked as Solved
          </span>
        </div>
      )}
    </div>
  );
}
