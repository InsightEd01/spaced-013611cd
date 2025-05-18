import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Get attendance data for the past 6 months
    const today = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(today.getMonth() - 6);

    const [schoolAttendance, regionalAttendance, schoolGrades, regionalGrades] = await Promise.all([
      // Get school attendance
      supabase
        .from('attendance')
        .select('date, status, count(*)')
        .eq('school_id', params.id)
        .gte('date', sixMonthsAgo.toISOString())
        .group_by('date, status'),

      // Get regional attendance (other schools in the same region)
      supabase
        .from('attendance')
        .select('date, status, count(*)')
        .not('school_id', 'eq', params.id)
        .in('school_id', 
          supabase
            .from('schools')
            .select('id')
            .eq('region', 
              supabase
                .from('schools')
                .select('region')
                .eq('id', params.id)
                .single()
            )
        )
        .gte('date', sixMonthsAgo.toISOString())
        .group_by('date, status'),

      // Get school grades
      supabase
        .from('assessment_scores')
        .select('assessments (date), score')
        .eq('school_id', params.id)
        .gte('assessments.date', sixMonthsAgo.toISOString()),

      // Get regional grades
      supabase
        .from('assessment_scores')
        .select('assessments (date), score')
        .not('school_id', 'eq', params.id)
        .in('school_id', 
          supabase
            .from('schools')
            .select('id')
            .eq('region', 
              supabase
                .from('schools')
                .select('region')
                .eq('id', params.id)
                .single()
            )
        )
        .gte('assessments.date', sixMonthsAgo.toISOString()),
    ]);

    // Transform the data into month-by-month metrics
    const metrics = [];
    for (let i = 0; i < 6; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const month = date.toLocaleString('default', { month: 'short' });
      const year = date.getFullYear();

      metrics.unshift({
        month: `${month} ${year}`,
        attendance: calculateAttendanceRate(schoolAttendance.data || [], date),
        regionalAttendance: calculateAttendanceRate(regionalAttendance.data || [], date),
        grades: calculateGradeAverage(schoolGrades.data || [], date),
        regionalGrades: calculateGradeAverage(regionalGrades.data || [], date),
      });
    }

    return NextResponse.json({ metrics });
  } catch (error) {
    console.error('Error fetching school metrics:', error);
    return NextResponse.json({ error: 'Failed to fetch metrics' }, { status: 500 });
  }
}

function calculateAttendanceRate(data: any[], date: Date) {
  const monthData = data.filter(d => {
    const recordDate = new Date(d.date);
    return recordDate.getMonth() === date.getMonth() &&
           recordDate.getFullYear() === date.getFullYear();
  });

  const total = monthData.reduce((acc, curr) => acc + parseInt(curr.count), 0);
  const present = monthData
    .filter(d => d.status === 'present')
    .reduce((acc, curr) => acc + parseInt(curr.count), 0);

  return total > 0 ? Math.round((present / total) * 100) : 0;
}

function calculateGradeAverage(data: any[], date: Date) {
  const monthData = data.filter(d => {
    const recordDate = new Date(d.assessments.date);
    return recordDate.getMonth() === date.getMonth() &&
           recordDate.getFullYear() === date.getFullYear();
  });

  const total = monthData.length;
  const sum = monthData.reduce((acc, curr) => acc + curr.score, 0);

  return total > 0 ? Math.round((sum / total) * 100) / 100 : 0;
}
