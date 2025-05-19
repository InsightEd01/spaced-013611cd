
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import MainLayout from './MainLayout';
import { 
  Home, 
  Calendar,
  FileText,
  Bell, 
  MessageSquare,
  Settings
} from 'lucide-react';

interface ParentLayoutProps {
  children: React.ReactNode;
  title?: string;
}

const ParentLayout: React.FC<ParentLayoutProps> = ({ children, title }) => {
  const location = useLocation();
  
  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/parent/dashboard' },
    { icon: Calendar, label: 'Attendance', path: '/parent/attendance' },
    { icon: FileText, label: 'Academic Reports', path: '/parent/reports' },
    { icon: Bell, label: 'Announcements', path: '/parent/announcements' },
    { icon: MessageSquare, label: 'Feedback', path: '/parent/feedback' },
    { icon: Settings, label: 'Settings', path: '/parent/settings' },
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

export default ParentLayout;
