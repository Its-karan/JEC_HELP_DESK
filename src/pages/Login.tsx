import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import jecLogo from '@/assets/jec-logo.png';
import { GraduationCap, Shield } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [portal, setPortal] = useState<'student' | 'authority'>('student');
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const success = await login({ id, password, portal });
      if (success) {
        navigate('/');
      } else {
        setError(portal === 'student' ? 'Invalid Enrollment Number or Password' : 'Invalid Employee ID or Password');
      }
    } catch (err) {
      setError('Connection Error. Please check Supabase setup.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen jec-header-gradient flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden opacity-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-white rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-md z-10 animate-fade-in">
        {/* Logo and Institution Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-4 bg-white rounded-2xl shadow-xl mb-4 transform hover:scale-110 transition-transform cursor-pointer">
            <img src={jecLogo} alt="JEC Logo" className="w-16 h-16 md:w-20 md:h-20" />
          </div>
          <h2 className="text-white text-2xl font-bold tracking-tight">JEC-RESOLVE</h2>
          <p className="text-white/80 text-sm font-medium mt-1">Institutional Grievance Redressal System</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-black/20 backdrop-blur-md p-1 rounded-xl mb-6 shadow-inner">
          <button
            onClick={() => { setPortal('student'); setError(''); setId(''); setPassword(''); }}
            className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${portal === 'student' ? 'bg-[#ffc61a] text-black shadow-lg' : 'text-white/70 hover:text-white'}`}
          >
            STUDENT PORTAL
          </button>
          <button
            onClick={() => { setPortal('authority'); setError(''); setId(''); setPassword(''); }}
            className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${portal === 'authority' ? 'bg-[#ffc61a] text-black shadow-lg' : 'text-white/70 hover:text-white'}`}
          >
            AUTHORITY LOGIN
          </button>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl p-8 shadow-2xl border border-white/20">
          <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            {portal === 'student' ? <GraduationCap className="w-5 h-5 text-[#b91c1c]" /> : <Shield className="w-5 h-5 text-[#b91c1c]" />}
            {portal === 'student' ? 'Student Sign-In' : 'Authority Login'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Unique Identifier / ID</label>
              <div className="relative group">
                <input
                  type="text"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 text-sm bg-slate-50 focus:border-[#b91c1c] focus:bg-white outline-none transition-all"
                  placeholder={portal === 'student' ? 'Enrollment Number' : 'Employee ID'}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Password</label>
              <div className="relative group">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 text-sm bg-slate-50 focus:border-[#b91c1c] focus:bg-white outline-none transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 border border-red-100 text-xs py-3 px-4 rounded-xl flex items-center gap-2 animate-pulse">
                <Shield className="w-4 h-4" /> {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full jec-header-gradient text-white py-4 rounded-xl font-bold shadow-lg hover:shadow-xl hover:translate-y-[-2px] active:translate-y-[0px] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? 'Authenticating...' : 'Access Portal'}
            </button>
          </form>

          {/* Interactive Demo Credentials */}
          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Click to Auto-fill Demo Access</p>
            <div className="grid grid-cols-2 gap-3">
              {portal === 'student' ? (
                <>
                  <button type="button" onClick={() => { setId('0201EC25101'); setPassword('student123'); }} className="text-[10px] p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-600 font-bold transition-colors">
                    ID: 0201EC25101
                  </button>
                  <button type="button" onClick={() => { setId('0201CS25102'); setPassword('student123'); }} className="text-[10px] p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-600 font-bold transition-colors">
                    ID: 0201CS25102
                  </button>
                </>
              ) : (
                <>
                  <div className="col-span-2 grid grid-cols-3 gap-2">
                    {['HOSTEL_ADMIN', 'ACAD_ADMIN', 'INFRA_ADMIN', 'ACCOUNTS_ADMIN', 'IT_ADMIN', 'WELFARE_ADMIN'].map(aid => (
                      <button key={aid} type="button" onClick={() => { setId(aid); setPassword('admin123'); }} className="text-[8px] p-2 bg-[#b91c1c]/5 hover:bg-[#b91c1c]/10 border border-[#b91c1c]/10 rounded-lg text-[#b91c1c] font-bold transition-colors truncate">
                        {aid}
                      </button>
                    ))}
                  </div>

                  <div className="col-span-2 border-t border-slate-400/20 my-3"></div>
                  <p className="col-span-2 text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-2">Escalation Authorities (Level 2, 3 & 4)</p>
                  
                  <div className="col-span-2 grid grid-cols-3 gap-2">
                    {['DEPT_HEAD_01', 'BRANCH_HOD_01', 'PRINCIPAL_JEC'].map(aid => (
                      <button key={aid} type="button" onClick={() => { setId(aid); setPassword('admin123'); }} className="text-[8px] p-2 bg-slate-400/5 hover:bg-slate-400/10 border border-slate-400/10 rounded-lg text-slate-700 font-bold transition-colors truncate">
                        {aid}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
            <p className="text-[9px] text-slate-400 mt-4 italic font-medium">Internal System — JEC IT CELL (M.P.)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
