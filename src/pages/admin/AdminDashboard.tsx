import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import AdminLayout from '@/components/layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Users,
  GraduationCap,
  BookOpen,
  Activity,
  UserPlus,
  School,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { columns } from './columns';

interface SchoolStats {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  attendanceRate: number;
  recentEnrollments: Array<{
    id: string;
    name: string;
    class_name: string;
    date: string;
  }>;
  topClasses: Array<{
    id: string;
    name: string;
    performance: number;
  }>;
}

const AdminDashboard = () => {
  const { authState } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<SchoolStats | null>(null);

  useEffect(() => {
    fetchSchoolStats();
  }, []);

  const fetchSchoolStats = async () => {
    try {
      // Get total students
      const { count: studentCount } = await supabase
        .from('students')
        .select('*', { count: 'exact' })
        .eq('school_id', authState.schoolId);

      // Get total teachers
      const { count: teacherCount } = await supabase
        .from('teachers')
        .select('*', { count: 'exact' })
        .eq('school_id', authState.schoolId);

      // Get total classes
      const { count: classCount } = await supabase
        .from('classes')
        .select('*', { count: 'exact' })
        .eq('school_id', authState.schoolId);

      // Get recent enrollments
      const { data: recentEnrollments } = await supabase
        .from('students')
        .select(`
          id,
          name,
          classes (class_name),
          created_at
        `)
        .eq('school_id', authState.schoolId)
        .order('created_at', { ascending: false })
        .limit(5);

      // Mock data for demonstration
      const mockTopClasses = [
        { id: '1', name: 'Class 10A', performance: 92 },
        { id: '2', name: 'Class 9B', performance: 88 },
        { id: '3', name: 'Class 11C', performance: 85 },
      ];

      setStats({
        totalStudents: studentCount || 0,
        totalTeachers: teacherCount || 0,
        totalClasses: classCount || 0,
        attendanceRate: 92, // This would be calculated from actual attendance records
        recentEnrollments: recentEnrollments?.map(e => ({
          id: e.id,
          name: e.name,
          class_name: e.classes?.class_name || '',
          date: e.created_at,
        })) || [],
        topClasses: mockTopClasses,
      });

      setLoading(false);
    } catch (error) {
      console.error('Error fetching school stats:', error);
      setLoading(false);
    }
  };

  if (loading || !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">School Dashboard</h1>
          <div className="flex gap-3">
            <Button>
              <UserPlus className="h-4 w-4 mr-2" /> Add Teacher
            </Button>
            <Button>
              <School className="h-4 w-4 mr-2" /> Add Class
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
              <div className="text-2xl font-bold">{stats.totalStudents}</div>
              <p className="text-xs text-muted-foreground">
                Across all classes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Teachers</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalTeachers}</div>
              <p className="text-xs text-muted-foreground">Active teachers</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Classes</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalClasses}</div>
              <p className="text-xs text-muted-foreground">Total classes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Attendance</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.attendanceRate}%</div>
              <Progress value={stats.attendanceRate} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Enrollments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.recentEnrollments.map(enrollment => (
                  <div
                    key={enrollment.id}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="text-sm font-medium">{enrollment.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {enrollment.class_name}
                      </p>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {new Date(enrollment.date).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Performing Classes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.topClasses.map(classInfo => (
                  <div key={classInfo.id} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">
                        {classInfo.name}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {classInfo.performance}%
                      </span>
                    </div>
                    <Progress value={classInfo.performance} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
