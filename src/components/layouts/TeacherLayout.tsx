
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import MainLayout from './MainLayout';
import { 
  Home, 
  Users,
  CheckSquare,
  FileText,
  Bell,
  MessageSquare
} from 'lucide-react';

interface TeacherLayoutProps {
  children: React.ReactNode;
  title: string;
}

const TeacherLayout: React.FC<TeacherLayoutProps> = ({ children, title }) => {
  const location = useLocation();
  
  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/teacher/dashboard' },
    { icon: Users, label: 'Students', path: '/teacher/students' },
    { icon: CheckSquare, label: 'Attendance', path: '/teacher/attendance' },
    { icon: FileText, label: 'Assessments', path: '/teacher/assessments' },
    { icon: Bell, label: 'Announcements', path: '/teacher/announcements' },
    { icon: MessageSquare, label: 'Messages', path: '/teacher/messages' },
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

export default TeacherLayout;
