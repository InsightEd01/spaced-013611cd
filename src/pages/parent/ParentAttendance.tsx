
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import ParentLayout from '@/components/layouts/ParentLayout';
import { Calendar } from '@/components/ui/calendar';
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
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface Student {
  id: string;
  first_name: string;
  last_name: string;
}

interface AttendanceRecord {
  id: string;
  date: string;
  status: 'present' | 'absent' | 'late';
}

const ParentAttendance = () => {
  const { authState } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
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
      fetchAttendanceRecords();
    }
  }, [selectedStudent, selectedDate]);

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

  const fetchAttendanceRecords = async () => {
    try {
      setLoading(true);
      
      // Calculate the start of the month for the selected date
      const startOfMonth = new Date(selectedDate!);
      startOfMonth.setDate(1);
      
      // Calculate the end of the month for the selected date
      const endOfMonth = new Date(selectedDate!);
      endOfMonth.setMonth(endOfMonth.getMonth() + 1);
      endOfMonth.setDate(0);
      
      const { data, error } = await supabase
        .from('attendance')
        .select('id, date, status')
        .eq('student_id', selectedStudent)
        .gte('date', startOfMonth.toISOString().split('T')[0])
        .lte('date', endOfMonth.toISOString().split('T')[0])
        .order('date', { ascending: false });

      if (error) throw error;

      // Type assertion to ensure status matches our type
      const typedData: AttendanceRecord[] = (data || []).map(record => ({
        ...record,
        status: record.status as 'present' | 'absent' | 'late'
      }));

      setAttendanceRecords(typedData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching attendance records:', error);
      toast.error('Failed to load attendance records');
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present':
        return <CheckCircle className="text-green-500 h-5 w-5" />;
      case 'absent':
        return <XCircle className="text-red-500 h-5 w-5" />;
      case 'late':
        return <AlertTriangle className="text-yellow-500 h-5 w-5" />;
      default:
        return null;
    }
  };

  if (loading && !students.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <ParentLayout title="Attendance">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Attendance Records</h1>
          <p className="text-gray-500">
            View your child's attendance history
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Select Student</CardTitle>
              <CardDescription>
                Choose which child's attendance to view
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select 
                value={selectedStudent || ''} 
                onValueChange={setSelectedStudent}
              >
                <SelectTrigger>
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

              <div className="pt-4">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Attendance History</CardTitle>
              <CardDescription>
                Records for {selectedDate?.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
              ) : attendanceRecords.length > 0 ? (
                <div className="space-y-4">
                  {attendanceRecords.map(record => (
                    <div
                      key={record.id}
                      className="flex items-center justify-between p-4 border rounded-md"
                    >
                      <span className="font-medium">
                        {new Date(record.date).toLocaleDateString()}
                      </span>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(record.status)}
                        <span className="capitalize">{record.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No attendance records found for this period.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ParentLayout>
  );
};

export default ParentAttendance;
