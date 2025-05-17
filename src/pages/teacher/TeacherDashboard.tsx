
import React from 'react';
import TeacherLayout from '@/components/layouts/TeacherLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, CheckSquare, FileText, Bell } from 'lucide-react';

const TeacherDashboard: React.FC = () => {
  const stats = [
    {
      title: 'My Students',
      value: '58',
      icon: Users,
      color: 'bg-blue-100 text-edu-blue',
    },
    {
      title: 'Today\'s Attendance',
      value: '54/58',
      icon: CheckSquare,
      color: 'bg-green-100 text-green-700',
    },
    {
      title: 'Pending Assessments',
      value: '3',
      icon: FileText,
      color: 'bg-purple-100 text-purple-700',
    },
    {
      title: 'New Messages',
      value: '12',
      icon: Bell,
      color: 'bg-amber-100 text-amber-700',
    },
  ];

  const todayClasses = [
    {
      id: 1,
      name: 'Mathematics - Grade 9A',
      time: '08:30 - 09:30',
      room: 'Room 101',
    },
    {
      id: 2,
      name: 'Mathematics - Grade 10C',
      time: '10:00 - 11:00',
      room: 'Room 205',
    },
    {
      id: 3,
      name: 'Mathematics - Grade 8B',
      time: '13:15 - 14:15',
      room: 'Room 103',
    },
    {
      id: 4,
      name: 'Mathematics - Grade 9B',
      time: '14:30 - 15:30',
      room: 'Room 202',
    },
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'attendance',
      message: 'Marked attendance for Grade 9A',
      time: '2 hours ago',
    },
    {
      id: 2,
      type: 'assessment',
      message: 'Uploaded math test results for Grade 10C',
      time: 'Yesterday',
    },
    {
      id: 3,
      type: 'student',
      message: 'Added new student: Michael Brown',
      time: '3 days ago',
    },
  ];

  return (
    <TeacherLayout title="Teacher Dashboard">
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
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Today's Classes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {todayClasses.map((cls) => (
                  <div key={cls.id} className="bg-gray-50 p-4 rounded-md">
                    <div className="flex justify-between items-center">
                      <h4 className="font-semibold">{cls.name}</h4>
                      <span className="text-xs font-medium bg-blue-100 text-blue-800 py-1 px-2 rounded">
                        {cls.time}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{cls.room}</p>
                  </div>
                ))}
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
                  Take Attendance
                </button>
                <button className="bg-edu-teal text-white w-full py-2 rounded-md hover:bg-teal-700 transition-colors">
                  Upload Assessment
                </button>
                <button className="bg-edu-amber text-white w-full py-2 rounded-md hover:bg-amber-700 transition-colors">
                  Send Announcement
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`p-2 rounded-full ${
                    activity.type === 'attendance' ? 'bg-green-100' :
                    activity.type === 'assessment' ? 'bg-purple-100' :
                    'bg-blue-100'
                  }`}>
                    {activity.type === 'attendance' && <CheckSquare className="h-5 w-5 text-green-700" />}
                    {activity.type === 'assessment' && <FileText className="h-5 w-5 text-purple-700" />}
                    {activity.type === 'student' && <Users className="h-5 w-5 text-blue-700" />}
                  </div>
                  <div>
                    <p className="font-medium">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </TeacherLayout>
  );
};

export default TeacherDashboard;
