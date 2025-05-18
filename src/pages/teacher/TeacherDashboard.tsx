import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Calendar } from '@/components/ui/calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, BookOpen, Calendar as CalendarIcon, Clock } from 'lucide-react';
import TeacherLayout from '@/components/layouts/TeacherLayout';

interface ClassInfo {
  id: string;
  name: string;
  totalStudents: number;
  attendance: number;
  subjects: Array<{
    id: string;
    name: string;
    completed: number;
    total: number;
  }>;
  upcomingLessons: Array<{
    id: string;
    subject: string;
    time: string;
    date: string;
  }>;
}

const TeacherDashboard = () => {
  const { authState } = useAuth();
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState<ClassInfo[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  useEffect(() => {
    fetchClassInfo();
  }, []);

  const fetchClassInfo = async () => {
    try {
      // Get teacher's classes
      const { data: teacherClasses, error: classError } = await supabase
        .from('class_teachers')
        .select(`
          classes (
            id,
            class_name
          )
        `)
        .eq('teacher_id', authState.user?.id);

      if (classError) throw classError;

      // Get detailed information for each class
      const classesData = await Promise.all(
        (teacherClasses || []).map(async ({ classes }) => {
          // Get total students
          const { count: studentCount } = await supabase
            .from('students')
            .select('*', { count: 'exact' })
            .eq('class_id', classes.id);

          // Get subjects
          const { data: subjects } = await supabase
            .from('subjects')
            .select('*')
            .eq('school_id', authState.schoolId);

          // Get upcoming lessons (this would be from a lessons table in a real app)
          const upcomingLessons = [
            {
              id: '1',
              subject: 'Mathematics',
              time: '09:00',
              date: new Date().toISOString(),
            },
            // Add more mock data as needed
          ];

          return {
            id: classes.id,
            name: classes.class_name,
            totalStudents: studentCount || 0,
            attendance: 90, // This would be calculated from actual attendance records
            subjects: subjects?.map(s => ({
              id: s.id,
              name: s.subject_name,
              completed: 15, // This would be tracked in a real app
              total: 30,
            })) || [],
            upcomingLessons,
          };
        })
      );

      setClasses(classesData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching class info:', error);
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
    <TeacherLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Teacher Dashboard</h1>

        <Tabs defaultValue={classes[0]?.id} className="space-y-6">
          <TabsList>
            {classes.map(classInfo => (
              <TabsTrigger key={classInfo.id} value={classInfo.id}>
                {classInfo.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {classes.map(classInfo => (
            <TabsContent key={classInfo.id} value={classInfo.id}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium">Students</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{classInfo.totalStudents}</div>
                    <p className="text-xs text-muted-foreground">Total students</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium">Attendance</CardTitle>
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{classInfo.attendance}%</div>
                    <Progress value={classInfo.attendance} className="mt-2" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium">Subjects</CardTitle>
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{classInfo.subjects.length}</div>
                    <p className="text-xs text-muted-foreground">Active subjects</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium">Next Lesson</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {classInfo.upcomingLessons[0]?.time || 'No lessons'}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {classInfo.upcomingLessons[0]?.subject}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Curriculum Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {classInfo.subjects.map(subject => (
                        <div key={subject.id} className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">{subject.name}</span>
                            <span className="text-sm text-muted-foreground">
                              {subject.completed}/{subject.total} lessons
                            </span>
                          </div>
                          <Progress
                            value={(subject.completed / subject.total) * 100}
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Schedule</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className="rounded-md border shadow"
                    />
                    <div className="mt-4">
                      <h4 className="text-sm font-semibold mb-2">Today's Lessons</h4>
                      <div className="space-y-2">
                        {classInfo.upcomingLessons.map(lesson => (
                          <div
                            key={lesson.id}
                            className="flex items-center justify-between text-sm"
                          >
                            <span>{lesson.subject}</span>
                            <span className="text-muted-foreground">
                              {lesson.time}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </TeacherLayout>
  );
};

export default TeacherDashboard;
