
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DateRange } from 'react-day-picker';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { TrendingUp, Users, BookOpen, Calendar as CalendarIcon, Download } from 'lucide-react';
import { format } from 'date-fns';

interface ReportData {
  attendanceData: Array<{ date: string; present: number; absent: number; late: number }>;
  gradeDistribution: Array<{ grade: string; count: number }>;
  subjectPerformance: Array<{ subject: string; averageScore: number; studentCount: number }>;
  enrollmentTrends: Array<{ month: string; enrollments: number }>;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function AdvancedReporting() {
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState<ReportData>({
    attendanceData: [],
    gradeDistribution: [],
    subjectPerformance: [],
    enrollmentTrends: []
  });
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [reportType, setReportType] = useState<string>('overview');
  const [classes, setClasses] = useState<Array<{ id: string; class_name: string }>>([]);

  useEffect(() => {
    fetchClasses();
    generateReport();
  }, [dateRange, selectedClass, reportType]);

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

  const generateReport = async () => {
    setLoading(true);
    try {
      // Generate attendance report
      const attendanceData = await generateAttendanceReport();
      
      // Generate grade distribution
      const gradeDistribution = await generateGradeDistribution();
      
      // Generate subject performance
      const subjectPerformance = await generateSubjectPerformance();
      
      // Generate enrollment trends
      const enrollmentTrends = await generateEnrollmentTrends();

      setReportData({
        attendanceData,
        gradeDistribution,
        subjectPerformance,
        enrollmentTrends
      });
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const generateAttendanceReport = async () => {
    let query = supabase
      .from('attendance')
      .select('date, status');

    if (selectedClass !== 'all') {
      query = query.eq('class_id', selectedClass);
    }

    if (dateRange?.from) {
      query = query.gte('date', format(dateRange.from, 'yyyy-MM-dd'));
    }

    if (dateRange?.to) {
      query = query.lte('date', format(dateRange.to, 'yyyy-MM-dd'));
    }

    const { data, error } = await query;
    if (error) throw error;

    // Group by date and count statuses
    const grouped = (data || []).reduce((acc: any, record) => {
      const date = record.date;
      if (!acc[date]) {
        acc[date] = { date, present: 0, absent: 0, late: 0 };
      }
      acc[date][record.status || 'absent']++;
      return acc;
    }, {});

    return Object.values(grouped);
  };

  const generateGradeDistribution = async () => {
    let query = supabase
      .from('assessment_scores')
      .select('score, assessments(max_score)');

    const { data, error } = await query;
    if (error) throw error;

    // Calculate grade distribution
    const grades = (data || []).map((score: any) => {
      const percentage = (score.score / score.assessments.max_score) * 100;
      if (percentage >= 90) return 'A';
      if (percentage >= 80) return 'B';
      if (percentage >= 70) return 'C';
      if (percentage >= 60) return 'D';
      return 'F';
    });

    const distribution = grades.reduce((acc: any, grade) => {
      acc[grade] = (acc[grade] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(distribution).map(([grade, count]) => ({
      grade,
      count: count as number
    }));
  };

  const generateSubjectPerformance = async () => {
    const { data, error } = await supabase
      .from('assessment_scores')
      .select(`
        score,
        assessments(max_score, subjects(subject_name))
      `);

    if (error) throw error;

    // Group by subject and calculate averages
    const subjectData = (data || []).reduce((acc: any, score: any) => {
      const subjectName = score.assessments?.subjects?.subject_name || 'Unknown';
      const percentage = (score.score / score.assessments.max_score) * 100;
      
      if (!acc[subjectName]) {
        acc[subjectName] = { scores: [], count: 0 };
      }
      acc[subjectName].scores.push(percentage);
      acc[subjectName].count++;
      return acc;
    }, {});

    return Object.entries(subjectData).map(([subject, data]: [string, any]) => ({
      subject,
      averageScore: data.scores.reduce((a: number, b: number) => a + b, 0) / data.scores.length,
      studentCount: data.count
    }));
  };

  const generateEnrollmentTrends = async () => {
    const { data, error } = await supabase
      .from('students')
      .select('created_at')
      .order('created_at');

    if (error) throw error;

    // Group by month
    const monthlyData = (data || []).reduce((acc: any, student) => {
      const month = format(new Date(student.created_at), 'MMM yyyy');
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(monthlyData).map(([month, enrollments]) => ({
      month,
      enrollments: enrollments as number
    }));
  };

  const exportReport = () => {
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `school-report-${format(new Date(), 'yyyy-MM-dd')}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success('Report exported successfully');
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Advanced Reporting & Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Generating reports...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Advanced Reporting & Analytics
              </CardTitle>
              <CardDescription>
                Comprehensive insights into school performance and trends
              </CardDescription>
            </div>
            <Button onClick={exportReport} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {classes.map((cls) => (
                  <SelectItem key={cls.id} value={cls.id}>
                    {cls.class_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-60">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd")} -{" "}
                        {format(dateRange.to, "LLL dd")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd")
                    )
                  ) : (
                    "Pick a date range"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
      </Card>

      {/* Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Attendance Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Attendance Trends</CardTitle>
            <CardDescription>Daily attendance patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={reportData.attendanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="present" fill="#22c55e" name="Present" />
                <Bar dataKey="absent" fill="#ef4444" name="Absent" />
                <Bar dataKey="late" fill="#f59e0b" name="Late" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Grade Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Grade Distribution</CardTitle>
            <CardDescription>Overall grade distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={reportData.gradeDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ grade, count }) => `${grade}: ${count}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {reportData.gradeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Subject Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Subject Performance</CardTitle>
            <CardDescription>Average scores by subject</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={reportData.subjectPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="subject" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="averageScore" fill="#3b82f6" name="Average Score %" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Enrollment Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Enrollment Trends</CardTitle>
            <CardDescription>Student enrollment over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={reportData.enrollmentTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="enrollments" stroke="#8b5cf6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
