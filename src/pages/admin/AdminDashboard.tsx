
import React from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen, Bell, CalendarCheck } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const stats = [
    {
      title: 'Total Teachers',
      value: '24',
      icon: Users,
      color: 'bg-blue-100 text-edu-blue',
    },
    {
      title: 'Total Students',
      value: '328',
      icon: Users,
      color: 'bg-green-100 text-green-700',
    },
    {
      title: 'Total Classes',
      value: '16',
      icon: BookOpen,
      color: 'bg-purple-100 text-purple-700',
    },
    {
      title: 'Attendance Rate',
      value: '94%',
      icon: CalendarCheck,
      color: 'bg-amber-100 text-amber-700',
    },
  ];

  const recentAnnouncements = [
    {
      id: 1,
      title: 'School Closure - Weather Advisory',
      date: '2025-05-15',
      content: 'Due to the severe weather forecast, school will be closed tomorrow.',
    },
    {
      id: 2,
      title: 'Parent-Teacher Conference',
      date: '2025-05-10',
      content: 'Annual parent-teacher conferences will be held next week. Please check the schedule.',
    },
    {
      id: 3,
      title: 'Sports Day Announcement',
      date: '2025-05-05',
      content: 'Annual sports day will be held on May 20th. All students are expected to participate.',
    },
  ];

  return (
    <AdminLayout title="Admin Dashboard">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                  <h3 className="text-3xl font-bold mt-1">{stat.value}</h3>
                </div>
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl">Recent Announcements</CardTitle>
            <Bell className="h-5 w-5 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAnnouncements.map((announcement) => (
                <div key={announcement.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="font-semibold">{announcement.title}</h4>
                    <span className="text-xs text-gray-500">{announcement.date}</span>
                  </div>
                  <p className="text-sm text-gray-600">{announcement.content}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Recent Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-4 border-edu-blue pl-4 py-1">
                  <p className="text-sm text-gray-600">Today, 9:30 AM</p>
                  <p className="font-medium">New teacher registered: Sarah Johnson</p>
                </div>
                <div className="border-l-4 border-edu-teal pl-4 py-1">
                  <p className="text-sm text-gray-600">Yesterday, 2:45 PM</p>
                  <p className="font-medium">Class schedule updated for Grade 10</p>
                </div>
                <div className="border-l-4 border-edu-amber pl-4 py-1">
                  <p className="text-sm text-gray-600">May 15, 11:20 AM</p>
                  <p className="font-medium">5 new students enrolled in Grade 8</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <button className="bg-edu-blue text-white w-full py-2 rounded-md hover:bg-blue-700 transition-colors">
                  Add New Teacher
                </button>
                <button className="bg-edu-teal text-white w-full py-2 rounded-md hover:bg-teal-700 transition-colors">
                  Create Announcement
                </button>
                <button className="bg-edu-amber text-white w-full py-2 rounded-md hover:bg-amber-700 transition-colors">
                  View Reports
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
