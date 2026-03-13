import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import jecLogo from '@/assets/jec-logo.png';
import amritMahotsavLogo from '@/assets/amrit-mahotsav.png';
import { LogOut, Phone, Mail, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/public-feed', label: 'Public Feed' },
    { to: '/about', label: 'About Us' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 shadow-md">
      {/* 1. Official JEC White Header */}
      <div className="bg-white flex flex-col md:flex-row justify-between items-center px-4 py-4 lg:px-12 gap-6 w-full">
        {/* Left Section (College Logo) */}
        <div className="flex-shrink-0">
          <img src={jecLogo} alt="JEC Logo" className="w-24 h-24 md:w-28 md:h-28 object-contain" />
        </div>
        
        {/* Center Section (Official Text) */}
        <div className="flex flex-col text-center justify-center flex-1">
          <h2 className="text-xl font-bold text-slate-800">जबलपुर अभियांत्रिकी महाविद्यालय, जबलपुर (म.प्र.)</h2>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#b91c1c] tracking-wide mt-1">JABALPUR ENGINEERING COLLEGE, JABALPUR (M.P.)</h1>
          <p className="text-sm font-medium text-gray-700 mt-1">(Established in 1947 as a Government Engineering College, जबलपुर)</p>
          <p className="text-sm font-medium text-gray-700">(Declared Autonomous by Govt. of Madhya Pradesh)</p>
        </div>

        {/* Right Section (Amrit Mahotsav Logo) */}
        <div className="flex-shrink-0">
          <img 
            src={amritMahotsavLogo} 
            alt="Amrit Mahotsav Logo" 
            className="w-20 h-20 md:w-24 md:h-24 object-contain" 
            onError={(e) => (e.currentTarget.style.display = 'none')}
          />
        </div>
      </div>

      {/* 2. Existing Deep Purple/Maroon Navbar */}
      <div className="jec-header-gradient px-4 py-3 flex items-center justify-between text-primary-foreground min-h-[56px]">
        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6 flex-1">
          <nav className="flex gap-6">
            {navLinks.map(l => (
              <Link key={l.to} to={l.to}
                className={`text-sm font-semibold transition-colors ${isActive(l.to) ? 'text-secondary border-b-2 border-secondary pb-1' : 'text-white hover:text-secondary'}`}
              >{l.label}</Link>
            ))}
          </nav>
        </div>

        {/* Mobile menu toggle */}
        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-1 flex items-center gap-2">
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          <span className="font-bold text-sm">Menu</span>
        </button>

        {/* User Actions & Support */}
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-4 text-xs opacity-90">
            <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> +91 7612331953</span>
            <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> prinjec.jbp@mp.gov.in</span>
          </div>

          {isAuthenticated && user && (
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-semibold">{user.name}</p>
                <p className="text-[10px] text-white/80 capitalize">{user.role}</p>
              </div>
              <button onClick={logout} className="flex items-center gap-1 text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded transition-colors">
                <LogOut className="w-3 h-3" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile nav dropdown */}
      {mobileOpen && (
        <div className="md:hidden bg-[#b91c1c] border-t border-white/20 px-4 pt-2 pb-4 space-y-2 shadow-inner">
          {navLinks.map(l => (
            <Link key={l.to} to={l.to} onClick={() => setMobileOpen(false)}
              className={`block px-3 py-2 rounded text-sm font-medium ${isActive(l.to) ? 'bg-white/20 text-white' : 'text-white/80 hover:text-white'}`}
            >{l.label}</Link>
          ))}
          {isAuthenticated && user && (
            <div className="px-3 py-2 text-xs text-white/70 border-t border-white/20 mt-2">
              Logged in: {user.name} ({user.role})
            </div>
          )}
        </div>
      )}

      <div className="bg-primary/95 text-primary-foreground py-1.5 overflow-hidden text-xs border-t border-white/10">
        <div className="animate-marquee whitespace-nowrap flex gap-12 items-center">
          <span className="text-yellow-300 font-semibold tracking-wide">
            ⚠️ DISCLAIMER: This is a student prototype built for the hackathon and is NOT the official website of Jabalpur Engineering College. Some visual assets and content are sourced from the official JEC website for educational demonstration purposes only.
          </span>
          <span className="text-yellow-300 font-semibold tracking-wide">
            ⚠️ DISCLAIMER: This is a student prototype built for the hackathon and is NOT the official website of Jabalpur Engineering College. Some visual assets and content are sourced from the official JEC website for educational demonstration purposes only.
          </span>
        </div>
      </div>
    </header>
  );
}
