import React from 'react';
import {
  Building2,
  LayoutDashboard,
  Users,
  ChartBar,
  CreditCard,
  FileText,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const mainNav = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    href: '/dashboard',
  },
  {
    title: 'Schools',
    icon: Building2,
    href: '/schools',
  },
  {
    title: 'Users',
    icon: Users,
    href: '/users',
  },
  {
    title: 'Analytics',
    icon: ChartBar,
    href: '/analytics',
  },
  {
    title: 'Billing',
    icon: CreditCard,
    href: '/billing',
  },
  {
    title: 'Audit Logs',
    icon: FileText,
    href: '/audit-logs',
  },
  {
    title: 'Settings',
    icon: Settings,
    href: '/settings',
  },
];

export default function SupaAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="hidden lg:flex lg:w-72 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-white">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <span className="text-xl font-semibold">Supa Admin</span>
            </div>
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {mainNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'group flex items-center px-2 py-2 text-sm font-medium rounded-md',
                    'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                    'transition-colors duration-150 ease-in-out'
                  )}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.title}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <div className="flex items-center">
              <div>
                <img
                  className="inline-block h-9 w-9 rounded-full"
                  src="/placeholder.svg"
                  alt="Avatar"
                />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">Admin User</p>
                <p className="text-xs text-gray-500">View Profile</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-72 flex flex-col flex-1">
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
