import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Download, FilePdf } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';

// Mock data for demonstration
const attendanceData = Array.from({ length: 6 }, (_, i) => ({
  region: ['North America', 'South America', 'Europe', 'Asia', 'Africa', 'Oceania'][i],
  average: Math.floor(Math.random() * 10) + 90,
}));

const gradeData = [
  { subject: 'Mathematics', average: 85, regional: 82 },
  { subject: 'Science', average: 88, regional: 84 },
  { subject: 'English', average: 82, regional: 80 },
  { subject: 'History', average: 86, regional: 83 },
  { subject: 'Art', average: 90, regional: 87 },
];

const monthlyTrends = Array.from({ length: 12 }, (_, i) => ({
  month: new Date(2024, i).toLocaleString('default', { month: 'short' }),
  attendance: Math.floor(Math.random() * 10) + 85,
  grades: Math.floor(Math.random() * 10) + 80,
  enrollments: Math.floor(Math.random() * 50) + 150,
}));

export default function AnalyticsPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Analytics Hub</h1>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" /> Export CSV
          </Button>
          <Button>
            <FilePdf className="h-4 w-4 mr-2" /> Generate Report
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="grades">Grades</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="attendance"
                        stroke="#0091ff"
                        name="Attendance Rate"
                      />
                      <Line
                        type="monotone"
                        dataKey="grades"
                        stroke="#00ff91"
                        name="Average Grades"
                      />
                      <Line
                        type="monotone"
                        dataKey="enrollments"
                        stroke="#ff9100"
                        name="New Enrollments"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="attendance">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Regional Attendance Rates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={attendanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="region" />
                      <YAxis domain={[80, 100]} />
                      <Tooltip />
                      <Bar dataKey="average" fill="#0091ff" name="Attendance Rate" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="grades">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Subject Performance vs Regional Average</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={gradeData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="subject" />
                      <YAxis domain={[60, 100]} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="average" fill="#00ff91" name="System Average" />
                      <Bar dataKey="regional" fill="#0091ff" name="Regional Average" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
