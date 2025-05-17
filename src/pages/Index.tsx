
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

const Index: React.FC = () => {
  const { authState } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Auto-redirect based on authentication and role
    if (!authState.loading) {
      if (!authState.user) {
        navigate('/login');
      } else {
        switch (authState.user.role) {
          case 'admin':
            navigate('/admin/dashboard');
            break;
          case 'teacher':
            navigate('/teacher/dashboard');
            break;
          case 'parent':
            navigate('/parent/dashboard');
            break;
          default:
            navigate('/login');
        }
      }
    }
  }, [authState.loading, authState.user, navigate]);

  // Show loading indicator while determining where to redirect
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
      <h1 className="text-2xl font-bold text-gray-700">School Management System</h1>
      <p className="text-gray-500 mt-2">Redirecting to the appropriate dashboard...</p>
    </div>
  );
};

export default Index;
