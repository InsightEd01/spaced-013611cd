import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Loader2 } from 'lucide-react';

interface SchoolMetricsProps {
  schoolId: string;
}

interface MetricData {
  attendanceRate: number;
  regionalAttendanceAvg: number;
  gradeAvg: number;
  regionalGradeAvg: number;
}

interface ChartData {
  month: string;
  attendance: number;
  regionalAttendance: number;
  grades: number;
  regionalGrades: number;
}

export default function SchoolMetrics({ schoolId }: SchoolMetricsProps) {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<ChartData[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const response = await fetch(`/api/schools/${schoolId}/metrics`);
        if (!response.ok) throw new Error('Failed to fetch metrics');
        
        const data = await response.json();
        setMetrics(data.metrics);
      } catch (error) {
        console.error('Error fetching metrics:', error);
        setError('Failed to load metrics');
      } finally {
        setLoading(false);
      }
    }

    fetchMetrics();
  }, [schoolId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64 text-destructive">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="h-72">
        <h3 className="text-lg font-semibold mb-4">Attendance Rate</h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={metrics}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="attendance"
              stroke="#2563eb"
              name="School"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="regionalAttendance"
              stroke="#9ca3af"
              name="Regional Average"
              strokeWidth={2}
              strokeDasharray="5 5"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="h-72">
        <h3 className="text-lg font-semibold mb-4">Grade Average</h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={metrics}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="grades"
              stroke="#2563eb"
              name="School"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="regionalGrades"
              stroke="#9ca3af"
              name="Regional Average"
              strokeWidth={2}
              strokeDasharray="5 5"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
