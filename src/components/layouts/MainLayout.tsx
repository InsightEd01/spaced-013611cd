
import React from 'react';
import { Sidebar } from '@/components/ui/sidebar';

export interface MainLayoutProps {
  children: React.ReactNode;
  title?: string; // Make title optional to fix typing issues
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, title }) => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-8">
        {title && <h1 className="text-3xl font-bold mb-6">{title}</h1>}
        {children}
      </div>
    </div>
  );
};

export default MainLayout;
