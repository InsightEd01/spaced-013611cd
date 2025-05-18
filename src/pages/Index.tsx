
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, Cloud, School } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { initializeDatabase } from '@/utils/seedDatabase';
import { toast } from 'sonner';

const Index: React.FC = () => {
  const { authState } = useAuth();
  const navigate = useNavigate();
  const [isSeeding, setIsSeeding] = useState(false);

  useEffect(() => {
    // Auto-redirect based on authentication and role
    if (!authState.loading && authState.user) {
      switch (authState.role) {
        case 'supa_admin':
          navigate('/admin/dashboard');
          break;
        case 'admin':
          navigate('/school/dashboard');
          break;
        case 'teacher':
          navigate('/teacher/dashboard');
          break;
        case 'parent':
          navigate('/parent/dashboard');
          break;
      }
    }
  }, [authState.loading, authState.user, authState.role, navigate]);

  const handleSeedDatabase = async () => {
    setIsSeeding(true);
    try {
      await initializeDatabase();
      toast.success('Database seeded successfully!');
    } catch (error) {
      console.error('Error seeding database:', error);
      toast.error('Failed to seed database');
    } finally {
      setIsSeeding(false);
    }
  };

  // Show welcome page with login/signup options if not authenticated
  if (!authState.loading && !authState.user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white">
        <div className="bg-white p-10 rounded-xl shadow-lg max-w-lg w-full text-center space-y-8">
          <div className="mx-auto h-20 w-20 rounded-full bg-blue-600 flex items-center justify-center">
            <School className="h-12 w-12 text-white" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-800">School Management System</h1>
          <p className="text-gray-600">A comprehensive platform for school administrators, teachers, and parents.</p>
          
          <div className="grid gap-4">
            <Button 
              onClick={() => navigate('/login')} 
              className="bg-blue-600 hover:bg-blue-700 text-white w-full py-6 text-lg"
            >
              Sign In
            </Button>
            <Button 
              onClick={() => navigate('/signup')} 
              variant="outline" 
              className="border-blue-600 text-blue-600 hover:bg-blue-50 w-full py-6 text-lg"
            >
              Parent Sign Up
            </Button>
          </div>

          <div className="pt-6 border-t border-gray-200">
            <Button
              onClick={handleSeedDatabase}
              variant="ghost"
              disabled={isSeeding}
              className="text-gray-500 hover:text-blue-600 flex items-center gap-2"
            >
              {isSeeding ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Seeding database...
                </>
              ) : (
                <>
                  <Cloud className="h-4 w-4" />
                  Initialize with mock data
                </>
              )}
            </Button>
          </div>
        </div>
        
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Demo Accounts:</p>
          <p>Admin: admin@school.com / password</p>
          <p>Teacher: teacher@school.com / password</p>
          <p>Parent: parent@example.com / password</p>
        </div>
      </div>
    );
  }

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
