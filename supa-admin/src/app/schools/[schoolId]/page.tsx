import React from 'react';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
  Users,
  GraduationCap,
  BookOpen,
  Activity,
  AlertTriangle,
  Building,
  Mail,
  Phone,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface PageProps {
  params: {
    schoolId: string;
  };
}

export default async function SchoolDetailsPage({ params }: PageProps) {
  // This would be fetched from your API
  const school = {
    id: params.schoolId,
    name: 'International School of Excellence',
    region: 'North America',
    subscriptionPlan: 'premium',
    contactEmail: 'admin@school.edu',
    phone: '+1 (123) 456-7890',
    address: '123 Education St, Knowledge City',
    stats: {
      totalStudents: 850,
      totalTeachers: 45,
      totalClasses: 32,
      attendanceRate: 95,
    },
    performanceData: Array.from({ length: 12 }, (_, i) => ({
      month: new Date(2024, i).toLocaleString('default', { month: 'short' }),
      attendance: Math.floor(Math.random() * 20) + 80,
      grades: Math.floor(Math.random() * 15) + 80,
    })),
  };

  if (!school) {
    notFound();
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{school.name}</h1>
          <p className="text-gray-500">School ID: {school.id}</p>
        </div>
        <div className="flex gap-3">
          <Select defaultValue={school.subscriptionPlan}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select plan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="basic">Basic Plan</SelectItem>
              <SelectItem value="premium">Premium Plan</SelectItem>
              <SelectItem value="enterprise">Enterprise Plan</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="destructive">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Deactivate
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{school.stats.totalStudents}</div>
            <p className="text-xs text-muted-foreground">Enrolled students</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Teachers</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{school.stats.totalTeachers}</div>
            <p className="text-xs text-muted-foreground">Active teachers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Classes</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{school.stats.totalClasses}</div>
            <p className="text-xs text-muted-foreground">Total classes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Attendance</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{school.stats.attendanceRate}%</div>
            <Progress value={school.stats.attendanceRate} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Performance Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={school.performanceData}>
                  <defs>
                    <linearGradient id="attendance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0091ff" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#0091ff" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="grades" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00ff91" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#00ff91" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="attendance"
                    stroke="#0091ff"
                    fillOpacity={1}
                    fill="url(#attendance)"
                    name="Attendance Rate"
                  />
                  <Area
                    type="monotone"
                    dataKey="grades"
                    stroke="#00ff91"
                    fillOpacity={1}
                    fill="url(#grades)"
                    name="Average Grades"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>School Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="font-medium">Address</span>
              </div>
              <Input value={school.address} readOnly />
            </div>

            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="font-medium">Contact Email</span>
              </div>
              <Input value={school.contactEmail} readOnly />
            </div>

            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="font-medium">Phone</span>
              </div>
              <Input value={school.phone} readOnly />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
