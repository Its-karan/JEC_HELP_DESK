import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';
import { supabase } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  login: (credentials: { id: string; password: string; portal: 'student' | 'authority' }) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_STUDENTS: Record<string, User> = {
  '0201EC25101': { id: '0201EC25101', name: 'Aarav Sharma', role: 'student', degree: 'B.Tech', branch: 'Electronics & Communication Engineering (EC)', rollNumber: '0201EC25101' },
  '0201CS25102': { id: '0201CS25102', name: 'Nisha Verma', role: 'student', degree: 'B.Tech', branch: 'Computer Science & Engineering (CSE)', rollNumber: '0201CS25102' },
};

const MOCK_AUTHORITIES: Record<string, User> = {
  'HOSTEL_ADMIN': { id: 'HOSTEL_ADMIN', name: 'Mr. Rajesh Kumar', role: 'employee', department: 'Hostel & Mess' },
  'ACAD_ADMIN': { id: 'ACAD_ADMIN', name: 'Dr. Anita Singh', role: 'employee', department: 'Academics & Exam' },
  'INFRA_ADMIN': { id: 'INFRA_ADMIN', name: 'Mr. Vikram Patel', role: 'employee', department: 'Campus Infrastructure' },
  'ACCOUNTS_ADMIN': { id: 'ACCOUNTS_ADMIN', name: 'Dr. Suresh Mehra', role: 'employee', department: 'Administration & Accounts' },
  'IT_ADMIN': { id: 'IT_ADMIN', name: 'Dr. Priya Gupta', role: 'employee', department: 'IT & Tech Support' },
  'WELFARE_ADMIN': { id: 'WELFARE_ADMIN', name: 'Mr. Amit Shah', role: 'employee', department: 'Student Welfare' },
  'DEPT_HEAD_01': { id: 'DEPT_HEAD_01', name: 'Department Head', role: 'hod', department: 'Department Head' },
  'BRANCH_HOD_01': { id: 'BRANCH_HOD_01', name: 'Branch HOD', role: 'hod', department: 'Branch HOD' },
  'PRINCIPAL_JEC': { id: 'PRINCIPAL_JEC', name: 'Principal / Apex Authority', role: 'principal', department: 'Principal / Apex Authority' },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('jec-user');
    if (saved) setUser(JSON.parse(saved));
    setLoading(false);
  }, []);

  const login = async (credentials: { id: string; password: string; portal: 'student' | 'authority' }) => {
    // CRITICAL: HACKATHON DEMO BYPASS
    if (credentials.portal === 'student') {
      const mock = MOCK_STUDENTS[credentials.id];
      if (mock && credentials.password === 'student123') {
        setUser(mock);
        localStorage.setItem('jec-user', JSON.stringify(mock));
        return true;
      }
    } else {
      const mock = MOCK_AUTHORITIES[credentials.id];
      if (mock && credentials.password === 'admin123') {
        setUser(mock);
        localStorage.setItem('jec-user', JSON.stringify(mock));
        localStorage.setItem('active_emp_dept', mock.department || '');
        return true;
      }
    }

    // Normal Supabase Auth / Table Check
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .or(`roll_number.eq.${credentials.id},id_identifier.eq.${credentials.id}`)
        .single();

      if (!error && profile) {
        if ((credentials.portal === 'student' && credentials.password === 'student123') || 
            (credentials.portal === 'authority' && credentials.password === 'admin123')) {
          setUser(profile);
          localStorage.setItem('jec-user', JSON.stringify(profile));
          if (profile.department) localStorage.setItem('active_emp_dept', profile.department);
          return true;
        }
      }
    } catch (e) {
      console.error("Auth error:", e);
    }

    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('jec-user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
