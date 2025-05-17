
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/auth';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { authState } = useAuth();
  const location = useLocation();

  if (authState.loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-2 text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!authState.user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(authState.user.role)) {
    // Redirect based on role
    if (authState.user.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (authState.user.role === 'teacher') {
      return <Navigate to="/teacher/dashboard" replace />;
    } else if (authState.user.role === 'parent') {
      return <Navigate to="/parent/dashboard" replace />;
    } else {
      // Fallback to login if role is unknown
      return <Navigate to="/login" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
