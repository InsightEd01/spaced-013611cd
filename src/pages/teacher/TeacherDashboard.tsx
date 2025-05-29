
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import TeacherLayout from '@/components/layouts/TeacherLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { AlertCircle, Award, BookOpen, Users } from 'lucide-react';

// Define interfaces for the data types
interface TeacherClass {
  id: string;
  class_name: string;
}

interface Student {
  id: string;
  first_name: string;
  last_name: string;
}

const TeacherDashboard = () => {
  const { authState } = useAuth();
  const [teacherId, setTeacherId] = useState<string | null>(null);
  const [classes, setClasses] = useState<TeacherClass[]>([]);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalClasses: 0,
    attendanceRate: 85,
    upcomingTests: 3,
  });

  useEffect(() => {
    fetchTeacherData();
  }, [authState.user?.id]);

  const fetchTeacherData = async () => {
    try {
      // Get teacher ID
      const { data: teacher } = await supabase
        .from('teachers')
        .select('id')
        .eq('user_id', authState.user?.id)
        .single();

      if (teacher) {
        setTeacherId(teacher.id);

        // Get teacher's classes
        const { data: classesData } = await supabase
          .from('class_teachers')
          .select(`
            class_id,
            classes (
              id, 
              class_name
            )
          `)
          .eq('teacher_id', teacher.id);

        if (classesData && classesData.length > 0) {
          const formattedClasses = classesData.map((c: any) => ({
            id: c.classes.id,
            class_name: c.classes.class_name,
          }));
          
          setClasses(formattedClasses);
          setSelectedClass(formattedClasses[0].id);

          // Get students for the first class
          const { data: studentsData } = await supabase
            .from('students')
            .select('id, first_name, last_name')
            .eq('class_id', formattedClasses[0].id);

          if (studentsData) {
            setStudents(studentsData);
            setStats(prev => ({ ...prev, totalStudents: studentsData.length }));
          }

          setStats(prev => ({ ...prev, totalClasses: formattedClasses.length }));
        }
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching teacher data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <TeacherLayout title="Dashboard">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                Total Students
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalStudents}</div>
              <p className="text-xs text-muted-foreground">
                In all your classes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Classes</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalClasses}</div>
              <p className="text-xs text-muted-foreground">
                Classes you are teaching
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Attendance</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.attendanceRate}%</div>
              <p className="text-xs text-muted-foreground">
                Average attendance rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                Upcoming Tests
              </CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.upcomingTests}</div>
              <p className="text-xs text-muted-foreground">
                Tests in the next week
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="classes" className="w-full">
          <TabsList>
            <TabsTrigger value="classes">Classes</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
          </TabsList>
          <TabsContent value="classes">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <h2 className="text-xl font-semibold mb-4">Your Classes</h2>
                <div className="space-y-2">
                  {classes.map(cls => (
                    <Card key={cls.id}>
                      <CardHeader>
                        <CardTitle>{cls.class_name}</CardTitle>
                        <CardDescription>
                          {students.length} Students
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="list-disc pl-4">
                          {students.map(student => (
                            <li key={student.id}>
                              {student.first_name} {student.last_name}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-4">Actions</h2>
                <Button>Add Announcement</Button>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="calendar">
            <div>
              <h2 className="text-xl font-semibold mb-4">Calendar</h2>
              <Card>
                <CardContent className="grid gap-4">
                  <Calendar />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </TeacherLayout>
  );
};

export default TeacherDashboard;
