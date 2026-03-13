import { useAuth } from '@/context/AuthContext';
import StudentDashboard from './StudentDashboard';
import AuthorityDashboard from './AuthorityDashboard';
import Login from './Login';

const Index = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) return <Login />;
  if (user?.role === 'student') return <StudentDashboard />;
  return <AuthorityDashboard />;
};

export default Index;
