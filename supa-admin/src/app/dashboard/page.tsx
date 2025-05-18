import React from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Users,
  School,
  CreditCard,
  Activity,
  Plus,
  FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SchoolsTable } from '@/components/SchoolsTable';
import { AddSchoolDialog } from '@/components/AddSchoolDialog';

// Dynamically import the map component to avoid SSR issues
const SchoolsMap = dynamic(() => import('@/components/SchoolsMap'), {
  ssr: false,
  loading: () => <div className="h-[400px] w-full bg-gray-100 animate-pulse rounded-lg" />
});

export default async function Dashboard() {
  // This would be fetched from your API
  const stats = {
    totalSchools: 25,
    activeSubscriptions: 23,
    averageAttendance: 92,
    revenueGrowth: 15,
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Multi-School Dashboard</h1>
        <div className="flex gap-3">
          <AddSchoolDialog />
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" /> Generate Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Schools</CardTitle>
            <School className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSchools}</div>
            <p className="text-xs text-muted-foreground">Active schools in the system</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeSubscriptions}</div>
            <p className="text-xs text-muted-foreground">Paid subscriptions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Average Attendance</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageAttendance}%</div>
            <Progress value={stats.averageAttendance} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Revenue Growth</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{stats.revenueGrowth}%</div>
            <p className="text-xs text-muted-foreground">Compared to last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Schools Map</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <SchoolsMap />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Schools Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <SchoolsTable />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
