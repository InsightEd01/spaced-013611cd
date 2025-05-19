
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar } from 'recharts';
import { toast } from 'sonner';

interface Student {
  id: string;
  first_name: string;
  last_name: string;
}

interface Assessment {
  id: string;
  assessment_name: string;
  date: string;
  max_score: number;
  score?: number;
}

interface Subject {
  id: string;
  subject_name: string;
  assessments: Assessment[];
  averageScore: number;
}

const ParentReports = () => {
  const { authState } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authState.studentIds && authState.studentIds.length > 0) {
      fetchStudents();
    } else {
      setLoading(false);
    }
  }, [authState.studentIds]);

  useEffect(() => {
    if (selectedStudent) {
      fetchAcademicData();
    }
  }, [selectedStudent]);

  const fetchStudents = async () => {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('id, first_name, last_name')
        .in('id', authState.studentIds || []);

      if (error) throw error;

      if (data && data.length > 0) {
        setStudents(data);
        setSelectedStudent(data[0].id);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error('Failed to load students');
      setLoading(false);
    }
  };

  const fetchAcademicData = async () => {
    try {
      setLoading(true);
      
      // Get subjects for the student
      const { data: subjectData, error: subjectError } = await supabase
        .from('student_subjects')
        .select('subject_id, progress')
        .eq('student_id', selectedStudent);

      if (subjectError) throw subjectError;

      if (!subjectData || !subjectData.length) {
        setSubjects([]);
        setLoading(false);
        return;
      }

      const subjectIds = subjectData.map(s => s.subject_id);
      
      // Get subject names
      const { data: subjectNames, error: namesError } = await supabase
        .from('subjects')
        .select('id, subject_name')
        .in('id', subjectIds);

      if (namesError) throw namesError;
      
      // Get assessments for these subjects
      const { data: assessmentsData, error: assessmentsError } = await supabase
        .from('assessments')
        .select('id, assessment_name, date, max_score, subject_id')
        .in('subject_id', subjectIds)
        .order('date', { ascending: false });
      
      if (assessmentsError) throw assessmentsError;

      // Get student scores
      const { data: scoresData, error: scoresError } = await supabase
        .from('assessment_scores')
        .select('assessment_id, score')
        .eq('student_id', selectedStudent);
      
      if (scoresError) throw scoresError;
      
      // Map scores to assessments
      const scoresMap = (scoresData || []).reduce((map, item) => {
        map[item.assessment_id] = item.score;
        return map;
      }, {} as Record<string, number>);

      // Build subject objects with assessments and scores
      const subjectsWithData = subjectNames?.map(subject => {
        const subjectAssessments = (assessmentsData || [])
          .filter(assessment => assessment.subject_id === subject.id)
          .map(assessment => ({
            ...assessment,
            score: scoresMap[assessment.id]
          }));

        // Calculate average score
        let totalScore = 0;
        let totalMaxScore = 0;
        
        subjectAssessments.forEach(assessment => {
          if (assessment.score !== undefined) {
            totalScore += assessment.score;
            totalMaxScore += assessment.max_score;
          }
        });
        
        const averageScore = totalMaxScore > 0 ? (totalScore / totalMaxScore) * 100 : 0;

        return {
          id: subject.id,
          subject_name: subject.subject_name,
          assessments: subjectAssessments,
          progress: subjectData.find(s => s.subject_id === subject.id)?.progress || 0,
          averageScore: averageScore
        };
      }) || [];

      setSubjects(subjectsWithData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching academic data:', error);
      toast.error('Failed to load academic reports');
      setLoading(false);
    }
  };

  const prepareChartData = () => {
    // Prepare data for the performance chart
    return subjects.map(subject => ({
      name: subject.subject_name,
      score: subject.averageScore
    }));
  };

  if (loading && !students.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <ParentLayout title="Academic Reports">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Academic Reports</h1>
          <p className="text-gray-500">
            View your child's academic performance and assessments
          </p>
        </div>

        <div className="pb-4">
          <Select 
            value={selectedStudent || ''} 
            onValueChange={setSelectedStudent}
          >
            <SelectTrigger className="w-full md:w-72">
              <SelectValue placeholder="Select a student" />
            </SelectTrigger>
            <SelectContent>
              {students.map(student => (
                <SelectItem key={student.id} value={student.id}>
                  {student.first_name} {student.last_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Performance Overview</CardTitle>
                <CardDescription>Academic performance across all subjects</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={prepareChartData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip formatter={(value) => [`${value.toFixed(1)}%`, 'Score']} />
                      <Legend />
                      <Bar dataKey="score" name="Score (%)" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <h2 className="text-2xl font-semibold mt-6">Subject Details</h2>
            
            {subjects.length > 0 ? (
              <div className="space-y-6">
                {subjects.map(subject => (
                  <Card key={subject.id}>
                    <CardHeader>
                      <CardTitle>{subject.subject_name}</CardTitle>
                      <CardDescription>
                        Average score: {subject.averageScore.toFixed(1)}%
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <h4 className="text-sm font-medium mb-1">Progress</h4>
                        <Progress value={subject.progress || 0} className="h-2" />
                        <p className="text-xs text-gray-500 mt-1">{subject.progress || 0}% Complete</p>
                      </div>
                      
                      {subject.assessments.length > 0 ? (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium mb-2">Recent Assessments</h4>
                          <div className="space-y-2">
                            {subject.assessments.map(assessment => (
                              <div 
                                key={assessment.id} 
                                className="flex justify-between items-center p-3 bg-gray-50 rounded-md"
                              >
                                <div>
                                  <p className="font-medium">{assessment.assessment_name}</p>
                                  <p className="text-xs text-gray-500">
                                    {new Date(assessment.date).toLocaleDateString()}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="font-bold">
                                    {assessment.score !== undefined ? assessment.score : '-'} 
                                    <span className="text-gray-500">/{assessment.max_score}</span>
                                  </p>
                                  <p className="text-xs">
                                    {assessment.score !== undefined
                                      ? `${((assessment.score / assessment.max_score) * 100).toFixed(1)}%`
                                      : 'Not graded'}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <p className="text-gray-500 italic">No assessments available for this subject.</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                No subject data available for this student.
              </div>
            )}
          </>
        )}
      </div>
    </ParentLayout>
  );
};

export default ParentReports;
