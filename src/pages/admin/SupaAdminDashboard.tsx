import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, School as SchoolIcon, Users, BookOpen } from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { columns } from './columns';
import { School } from '@/types/database';
import { supabase } from '@/lib/supabase';

const SupaAdminDashboard = () => {
  const { authState } = useAuth();
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSchools: 0,
    activeSubscriptions: 0,
    totalStudents: 0,
  });

  useEffect(() => {
    fetchSchools();
    fetchStats();
  }, []);

  const fetchSchools = async () => {
    try {
      const { data, error } = await supabase
        .from('schools')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSchools(data || []);
    } catch (error) {
      console.error('Error fetching schools:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      // Get total schools
      const { count: schoolCount } = await supabase
        .from('schools')
        .select('*', { count: 'exact' });

      // Get active subscriptions
      const { count: activeSubscriptions } = await supabase
        .from('subscriptions')
        .select('*', { count: 'exact' })
        .eq('status', 'active');

      // Get total students
      const { count: studentCount } = await supabase
        .from('students')
        .select('*', { count: 'exact' });

      setStats({
        totalSchools: schoolCount || 0,
        activeSubscriptions: activeSubscriptions || 0,
        totalStudents: studentCount || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Supa Admin Dashboard</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add New School
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Schools</CardTitle>
            <SchoolIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSchools}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeSubscriptions} active subscriptions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Active Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              Across all schools
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Subscription Revenue</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(stats.activeSubscriptions * 299).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Monthly recurring revenue
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Schools</CardTitle>
          <CardDescription>
            A list of all schools in the system.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={schools}
            loading={loading}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default SupaAdminDashboard;
