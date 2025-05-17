
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';

interface MainLayoutProps {
  children: React.ReactNode;
  title: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, title }) => {
  const { authState, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-edu-blue">SchoolMS</span>
          </Link>
          
          {authState.user && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <User size={18} className="text-gray-600" />
                <span className="text-sm text-gray-600">
                  {authState.user.email} ({authState.user.role})
                </span>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-edu-red"
                onClick={handleLogout}
              >
                <LogOut size={16} className="mr-1" />
                Logout
              </Button>
            </div>
          )}
        </div>
      </header>
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">{title}</h1>
        {children}
      </main>
      
      <footer className="bg-gray-100 py-4">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          &copy; 2025 School Management System. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
