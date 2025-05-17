
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import MainLayout from './MainLayout';
import { 
  Home, 
  Users, 
  BookOpen, 
  Calendar, 
  Bell, 
  Settings
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title }) => {
  const location = useLocation();
  
  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: Users, label: 'Teachers', path: '/admin/teachers' },
    { icon: Users, label: 'Students', path: '/admin/students' },
    { icon: BookOpen, label: 'Classes', path: '/admin/classes' },
    { icon: Calendar, label: 'Schedule', path: '/admin/schedule' },
    { icon: Bell, label: 'Announcements', path: '/admin/announcements' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ];
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <MainLayout title={title}>
      <div className="flex flex-col md:flex-row gap-6">
        <aside className="w-full md:w-64 bg-white border border-gray-200 rounded-lg shadow-sm">
          <nav className="p-4">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                      isActive(item.path) 
                        ? 'bg-primary text-primary-foreground' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon size={18} className={`mr-2 ${isActive(item.path) ? '' : 'text-gray-500'}`} />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
        
        <div className="flex-1">
          {children}
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminLayout;
