import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { School, Menu, LogOut, User, Settings } from 'lucide-react';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const { authState, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const userInitials = authState.user?.email
    ?.split('@')[0]
    .slice(0, 2)
    .toUpperCase() || 'U';

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white border-b border-gray-200 fixed z-30 w-full">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="inline-flex lg:hidden"
              >
                <Menu className="h-6 w-6" />
              </Button>
              <Link to="/" className="flex items-center space-x-3">
                <School className="h-8 w-8 text-edu-blue" />
                <span className="self-center text-xl font-semibold whitespace-nowrap">
                  EduSystem
                </span>
              </Link>
            </div>
            <div className="flex items-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{userInitials}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {authState.user?.email}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {authState.role}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-16 flex">
        <div
          className={`${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } transition-transform duration-150 ease-in-out fixed lg:static 
          top-16 bottom-0 left-0 z-20 bg-white w-64 min-h-screen 
          border-r border-gray-200 py-4 px-3`}
        >
          <nav className="space-y-2">
            {/* Navigation items will be added based on role */}
            {authState.role === 'supa_admin' && (
              <>
                <Link
                  to="/admin/dashboard"
                  className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100"
                >
                  <School className="w-5 h-5" />
                  <span className="ml-3">Dashboard</span>
                </Link>
                {/* Add more navigation items */}
              </>
            )}
          </nav>
        </div>
        <main className="flex-1 p-4 lg:p-8 ml-0 lg:ml-64">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
