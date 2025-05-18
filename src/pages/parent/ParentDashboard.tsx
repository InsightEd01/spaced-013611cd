
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import ParentLayout from '@/components/layouts/ParentLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { BookOpen, GraduationCap, Trophy, Bell } from 'lucide-react';

interface StudentInfo {
  id: string;
  name: string;
  class_name: string;
  attendance: number;
  subjects: Array<{
    name: string;
    grade: string;
    progress: number;
  }>;
  upcoming_events: Array<{
    id: string;
    title: string;
    date: string;
    type: string;
  }>;
}

const ParentDashboard: React.FC = () => {
  const { authState } = useAuth();
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<StudentInfo[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  useEffect(() => {
    fetchStudentInfo();
  }, [authState.studentIds]);

  const fetchStudentInfo = async () => {
    try {
      if (!authState.studentIds?.length) return;

      const { data: studentsData, error } = await supabase
        .from('students')
        .select(`
          id,
          first_name,
          last_name,
          class_id,
          classes:class_id (class_name)
        `)
        .in('id', authState.studentIds);

      if (error) throw error;

      // Transform and enrich the data
      const enrichedData: StudentInfo[] = await Promise.all(
        (studentsData || []).map(async (student) => {
          // Fetch subjects and grades
          const { data: subjects } = await supabase
            .from('student_subjects')
            .select(`
              subjects:subject_id (subject_name),
              grade,
              progress
            `)
            .eq('student_id', student.id);

          // Fetch upcoming events
          const { data: events } = await supabase
            .from('assessments')
            .select('*')
            .gte('date', new Date().toISOString())
            .order('date')
            .limit(5);

          return {
            id: student.id,
            name: `${student.first_name} ${student.last_name}`,
            class_name: student.classes?.class_name || '',
            attendance: 95, // This would come from an attendance tracking system
            subjects: subjects?.map(s => ({
              name: s.subjects.subject_name,
              grade: s.grade || 'N/A',
              progress: s.progress || 0
            })) || [],
            upcoming_events: events?.map(e => ({
              id: e.id,
              title: e.assessment_name,
              date: e.date,
              type: e.assessment_type
            })) || []
          };
        })
      );

      setStudents(enrichedData);
    } catch (error) {
      console.error('Error fetching student info:', error);
    } finally {
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
    <ParentLayout title="Parent Dashboard">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Parent Dashboard</h1>

        <Tabs defaultValue={students[0]?.id} className="space-y-6">
          <TabsList>
            {students.map(student => (
              <TabsTrigger key={student.id} value={student.id}>
                {student.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {students.map(student => (
            <TabsContent key={student.id} value={student.id} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium">Class</CardTitle>
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{student.class_name}</div>
                    <p className="text-xs text-muted-foreground">Current class</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium">Attendance</CardTitle>
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{student.attendance}%</div>
                    <Progress value={student.attendance} className="mt-2" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium">Subjects</CardTitle>
                    <Trophy className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{student.subjects.length}</div>
                    <p className="text-xs text-muted-foreground">Enrolled subjects</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium">Events</CardTitle>
                    <Bell className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {student.upcoming_events.length}
                    </div>
                    <p className="text-xs text-muted-foreground">Upcoming events</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Subject Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {student.subjects.map(subject => (
                        <div key={subject.name} className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">{subject.name}</span>
                            <span className="text-sm text-muted-foreground">
                              Grade: {subject.grade}
                            </span>
                          </div>
                          <Progress value={subject.progress} />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Calendar</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className="rounded-md border shadow"
                    />
                    <div className="mt-4">
                      <h4 className="text-sm font-semibold mb-2">Upcoming Events</h4>
                      <div className="space-y-2">
                        {student.upcoming_events.map(event => (
                          <div
                            key={event.id}
                            className="flex items-center justify-between text-sm"
                          >
                            <span>{event.title}</span>
                            <span className="text-muted-foreground">
                              {new Date(event.date).toLocaleDateString()}
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
    </ParentLayout>
  );
};

export default ParentDashboard;
