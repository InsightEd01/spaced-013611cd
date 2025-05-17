
import React from 'react';
import ParentLayout from '@/components/layouts/ParentLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarCheck, FileText, Bell, MessageSquare } from 'lucide-react';

const ParentDashboard: React.FC = () => {
  const studentInfo = {
    name: 'John Doe',
    grade: '9th Grade',
    className: 'Section A',
    studentId: '1234567890',
  };

  const attendanceSummary = {
    present: 18,
    absent: 1,
    late: 1,
    total: 20,
    presentPercentage: '90%',
  };

  const recentAssessments = [
    {
      id: 1,
      subject: 'Mathematics',
      title: 'Mid-term Exam',
      score: '85/100',
      date: '2025-05-10',
    },
    {
      id: 2,
      subject: 'Science',
      title: 'Laboratory Assessment',
      score: '42/50',
      date: '2025-05-08',
    },
    {
      id: 3,
      subject: 'English',
      title: 'Essay Writing',
      score: '18/20',
      date: '2025-05-05',
    },
  ];

  const announcements = [
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
  ];

  return (
    <ParentLayout title="Parent Dashboard">
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-2xl font-bold">{studentInfo.name}</h3>
                <p className="text-gray-600">
                  {studentInfo.grade} | {studentInfo.className}
                </p>
                <p className="text-sm text-gray-500">
                  Student ID: {studentInfo.studentId}
                </p>
              </div>
              <div className="mt-4 md:mt-0 flex items-center space-x-2">
                <span className="bg-green-100 text-green-800 text-xs font-medium py-1 px-2 rounded">
                  Active
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl">Attendance Summary</CardTitle>
              <CalendarCheck className="h-5 w-5 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-3xl font-bold text-edu-blue">{attendanceSummary.presentPercentage}</h4>
                <p className="text-sm text-gray-600">Last 30 days</p>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-green-50 p-3 rounded-md">
                  <p className="text-2xl font-bold text-green-700">{attendanceSummary.present}</p>
                  <p className="text-xs text-gray-600">Present</p>
                </div>
                <div className="bg-red-50 p-3 rounded-md">
                  <p className="text-2xl font-bold text-red-700">{attendanceSummary.absent}</p>
                  <p className="text-xs text-gray-600">Absent</p>
                </div>
                <div className="bg-yellow-50 p-3 rounded-md">
                  <p className="text-2xl font-bold text-yellow-700">{attendanceSummary.late}</p>
                  <p className="text-xs text-gray-600">Late</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl">Recent Assessments</CardTitle>
              <FileText className="h-5 w-5 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentAssessments.map((assessment) => (
                  <div key={assessment.id} className="flex justify-between items-center border-b pb-2 last:border-0">
                    <div>
                      <p className="font-medium">{assessment.subject}</p>
                      <p className="text-sm text-gray-600">{assessment.title}</p>
                      <p className="text-xs text-gray-500">{assessment.date}</p>
                    </div>
                    <div className="text-lg font-bold text-edu-blue">
                      {assessment.score}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl">Announcements</CardTitle>
            <Bell className="h-5 w-5 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {announcements.map((announcement) => (
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
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl">Submit Feedback</CardTitle>
            <MessageSquare className="h-5 w-5 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <textarea 
                className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-edu-blue focus:border-transparent"
                placeholder="Write your feedback, suggestions, or questions here..."
                rows={4}
              />
              <button className="bg-edu-blue text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                Submit Feedback
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </ParentLayout>
  );
};

export default ParentDashboard;
