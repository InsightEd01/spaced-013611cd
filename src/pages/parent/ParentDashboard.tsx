
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import ParentLayout from '@/components/layouts/ParentLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

// Define interfaces for the data types
interface Student {
  id: string;
  first_name: string;
  last_name: string;
  class_name: string;
  class_id?: string;
}

interface Subject {
  id: string;
  subject_name: string;
  progress: number;
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
}

const ParentDashboard = () => {
  const { authState } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authState.studentIds && authState.studentIds.length > 0) {
      fetchStudentData();
    } else {
      setLoading(false);
    }
  }, [authState.studentIds]);

  const fetchStudentData = async () => {
    try {
      // Fetch student information
      const { data: studentsData, error: studentsError } = await supabase
        .from('students')
        .select('id, first_name, last_name, class_name, class_id')
        .in('id', authState.studentIds || []);

      if (studentsError) {
        throw studentsError;
      }

      if (studentsData) {
        setStudents(studentsData);

        // Fetch subjects for the first student
        if (studentsData.length > 0) {
          const { data: subjectsData, error: subjectsError } = await supabase
            .from('subjects')
            .select('id, subject_name')
            .eq('school_id', authState.schoolId);

          if (subjectsError) {
            throw subjectsError;
          }

          if (subjectsData) {
            // Mock progress data for demonstration
            const subjectsWithProgress = subjectsData.map((subject: any) => ({
              ...subject,
              progress: Math.floor(Math.random() * 100),
            }));
            setSubjects(subjectsWithProgress);
          }

          // Fetch announcements for the student's class
          if (studentsData[0].class_id) {
            const { data: announcementsData, error: announcementsError } = await supabase
              .from('announcements')
              .select('id, title, content, date')
              .eq('class_id', studentsData[0].class_id)
              .order('date', { ascending: false });

            if (announcementsError) {
              throw announcementsError;
            }

            if (announcementsData) {
              setAnnouncements(announcementsData);
            }
          }
        }
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching student data:', error);
      toast.error('Failed to load student data');
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
    <ParentLayout title="Dashboard">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-500">
            Welcome to your parent dashboard. Here you can view your children's
            information.
          </p>
        </div>

        {students.map(student => (
          <div key={student.id} className="space-y-4">
            <h2 className="text-2xl font-semibold">
              {student.first_name} {student.last_name}
            </h2>
            <p className="text-gray-600">Class: {student.class_name}</p>

            <Tabs defaultValue="subjects" className="w-full">
              <TabsList>
                <TabsTrigger value="subjects">Subjects</TabsTrigger>
                <TabsTrigger value="announcements">Announcements</TabsTrigger>
                <TabsTrigger value="attendance">Attendance</TabsTrigger>
              </TabsList>
              <TabsContent value="subjects" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {subjects.map(subject => (
                    <Card key={subject.id}>
                      <CardHeader>
                        <CardTitle>{subject.subject_name}</CardTitle>
                        <CardDescription>
                          {student.first_name}'s progress in {subject.subject_name}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Progress value={subject.progress} />
                        <p className="text-sm text-gray-500 mt-2">
                          {subject.progress}% Complete
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="announcements" className="space-y-4">
                <div className="space-y-4">
                  {announcements.map(announcement => (
                    <Card key={announcement.id}>
                      <CardHeader>
                        <CardTitle>{announcement.title}</CardTitle>
                        <CardDescription>
                          {new Date(announcement.date).toLocaleDateString()}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p>{announcement.content}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="attendance">
                <div>
                  <p>Attendance information will be displayed here.</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        ))}
      </div>
    </ParentLayout>
  );
};

export default ParentDashboard;
