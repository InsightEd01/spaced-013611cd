
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon, Save, Users } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface Student {
  id: string;
  first_name: string;
  last_name: string;
  student_number: string;
}

interface AttendanceRecord {
  student_id: string;
  status: 'present' | 'absent' | 'late';
}

interface Class {
  id: string;
  class_name: string;
}

export function AttendanceInterface() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [classes, setClasses] = useState<Class[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      fetchStudents();
      fetchExistingAttendance();
    }
  }, [selectedClass, selectedDate]);

  const fetchClasses = async () => {
    try {
      const { data, error } = await supabase
        .from('classes')
        .select('id, class_name')
        .order('class_name');

      if (error) throw error;
      setClasses(data || []);
    } catch (error) {
      console.error('Error fetching classes:', error);
      toast.error('Failed to load classes');
    }
  };

  const fetchStudents = async () => {
    if (!selectedClass) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('students')
        .select('id, first_name, last_name, student_number')
        .eq('class_id', selectedClass)
        .order('first_name');

      if (error) throw error;
      setStudents(data || []);

      // Initialize attendance records
      const initialAttendance = (data || []).map(student => ({
        student_id: student.id,
        status: 'present' as const
      }));
      setAttendance(initialAttendance);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const fetchExistingAttendance = async () => {
    if (!selectedClass || !selectedDate) return;

    try {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      const { data, error } = await supabase
        .from('attendance')
        .select('student_id, status')
        .eq('class_id', selectedClass)
        .eq('date', dateStr);

      if (error) throw error;

      if (data && data.length > 0) {
        setAttendance(data.map(record => ({
          student_id: record.student_id!,
          status: record.status as 'present' | 'absent' | 'late'
        })));
      }
    } catch (error) {
      console.error('Error fetching existing attendance:', error);
    }
  };

  const updateAttendance = (studentId: string, status: 'present' | 'absent' | 'late') => {
    setAttendance(prev => 
      prev.map(record => 
        record.student_id === studentId 
          ? { ...record, status }
          : record
      )
    );
  };

  const saveAttendance = async () => {
    if (!selectedClass || !selectedDate) {
      toast.error('Please select a class and date');
      return;
    }

    try {
      setSaving(true);
      const dateStr = format(selectedDate, 'yyyy-MM-dd');

      // Delete existing attendance for this date and class
      await supabase
        .from('attendance')
        .delete()
        .eq('class_id', selectedClass)
        .eq('date', dateStr);

      // Insert new attendance records
      const attendanceRecords = attendance.map(record => ({
        student_id: record.student_id,
        class_id: selectedClass,
        date: dateStr,
        status: record.status
      }));

      const { error } = await supabase
        .from('attendance')
        .insert(attendanceRecords);

      if (error) throw error;

      toast.success('Attendance saved successfully');
    } catch (error) {
      console.error('Error saving attendance:', error);
      toast.error('Failed to save attendance');
    } finally {
      setSaving(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present':
        return 'bg-green-500';
      case 'absent':
        return 'bg-red-500';
      case 'late':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Take Attendance
          </CardTitle>
          <CardDescription>
            Mark student attendance for your classes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Class</label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.class_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Select Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {selectedClass && students.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Students ({students.length})</h3>
                <Button onClick={saveAttendance} disabled={saving}>
                  <Save className="mr-2 h-4 w-4" />
                  {saving ? 'Saving...' : 'Save Attendance'}
                </Button>
              </div>

              <div className="space-y-2">
                {students.map((student) => {
                  const studentAttendance = attendance.find(a => a.student_id === student.id);
                  return (
                    <div key={student.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(studentAttendance?.status || 'present')}`} />
                        <div>
                          <p className="font-medium">{student.first_name} {student.last_name}</p>
                          <p className="text-sm text-muted-foreground">ID: {student.student_number}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant={studentAttendance?.status === 'present' ? 'default' : 'outline'}
                          onClick={() => updateAttendance(student.id, 'present')}
                        >
                          Present
                        </Button>
                        <Button
                          size="sm"
                          variant={studentAttendance?.status === 'late' ? 'default' : 'outline'}
                          onClick={() => updateAttendance(student.id, 'late')}
                        >
                          Late
                        </Button>
                        <Button
                          size="sm"
                          variant={studentAttendance?.status === 'absent' ? 'default' : 'outline'}
                          onClick={() => updateAttendance(student.id, 'absent')}
                        >
                          Absent
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {loading && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading students...</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
