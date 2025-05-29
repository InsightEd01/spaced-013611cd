
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import ParentLayout from '@/components/layouts/ParentLayout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { MessageSquare } from 'lucide-react';

interface Student {
  id: string;
  first_name: string;
  last_name: string;
  class_id: string;
  class_name: string;
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  teacher_name?: string;
  class_name?: string;
}

const ParentAnnouncements = () => {
  const { authState } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [announcements, setAnnouncements] = useState<Record<string, Announcement[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authState.studentIds && authState.studentIds.length > 0) {
      fetchStudentsAndAnnouncements();
    } else {
      setLoading(false);
    }
  }, [authState.studentIds]);

  const fetchStudentsAndAnnouncements = async () => {
    try {
      // Fetch students first - using correct column names
      const { data: studentsData, error: studentsError } = await supabase
        .from('students')
        .select(`
          id, 
          first_name, 
          last_name, 
          class_id,
          classes!inner(class_name)
        `)
        .in('id', authState.studentIds || []);

      if (studentsError) throw studentsError;

      if (!studentsData || studentsData.length === 0) {
        setLoading(false);
        return;
      }

      // Transform the data to match our interface
      const transformedStudents = studentsData.map((student: any) => ({
        id: student.id,
        first_name: student.first_name,
        last_name: student.last_name,
        class_id: student.class_id,
        class_name: student.classes?.class_name || 'Unknown Class'
      }));

      setStudents(transformedStudents);

      // Fetch announcements for each student's class
      const announcementsMap: Record<string, Announcement[]> = {};

      for (const student of transformedStudents) {
        if (student.class_id) {
          const { data: announcementsData, error: announcementsError } = await supabase
            .from('announcements')
            .select(`
              id,
              title,
              content,
              date,
              teachers!inner(name),
              classes!inner(class_name)
            `)
            .eq('class_id', student.class_id)
            .order('date', { ascending: false });

          if (announcementsError) {
            console.error('Error fetching announcements:', announcementsError);
            continue;
          }

          if (announcementsData) {
            announcementsMap[student.id] = announcementsData.map((announcement: any) => ({
              id: announcement.id,
              title: announcement.title,
              content: announcement.content,
              date: announcement.date,
              teacher_name: announcement.teachers?.name,
              class_name: announcement.classes?.class_name
            }));
          }
        }
      }

      setAnnouncements(announcementsMap);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load announcements');
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
    <ParentLayout title="Announcements">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Announcements</h1>
          <p className="text-gray-500">
            Stay informed about school and class announcements
          </p>
        </div>

        {students.length > 0 ? (
          <Tabs defaultValue={students[0].id} className="w-full">
            <TabsList className="mb-4">
              {students.map(student => (
                <TabsTrigger key={student.id} value={student.id}>
                  {student.first_name} {student.last_name}
                </TabsTrigger>
              ))}
            </TabsList>

            {students.map(student => (
              <TabsContent key={student.id} value={student.id} className="space-y-4">
                <h2 className="text-xl font-semibold">
                  Class: {student.class_name || 'Not assigned to a class'}
                </h2>

                {announcements[student.id]?.length > 0 ? (
                  <div className="space-y-4">
                    {announcements[student.id].map(announcement => (
                      <Card key={announcement.id}>
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle>{announcement.title}</CardTitle>
                              <CardDescription>
                                {format(new Date(announcement.date), 'MMMM dd, yyyy')}
                                {announcement.teacher_name && ` • By ${announcement.teacher_name}`}
                              </CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="prose max-w-none">
                            <p>{announcement.content}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <MessageSquare className="h-12 w-12 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No announcements</h3>
                    <p className="text-gray-500 max-w-sm mt-1">
                      There are currently no announcements for this student's class.
                    </p>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <MessageSquare className="h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No students found</h3>
            <p className="text-gray-500 max-w-sm mt-1">
              You don't have any students linked to your account.
            </p>
          </div>
        )}
      </div>
    </ParentLayout>
  );
};

export default ParentAnnouncements;
