import { Database } from './database';

export type School = Database['public']['Tables']['schools']['Row'];
export type Subscription = Database['public']['Tables']['subscriptions']['Row'];

export interface SchoolWithSubscription extends School {
  subscription: Subscription | null;
  totalStudents?: number;
  totalTeachers?: number;
  totalClasses?: number;
  attendanceRate?: number;
}

export type SubscriptionPlan = 'basic' | 'premium';
export type SchoolStatus = 'active' | 'inactive' | 'suspended';

export interface SchoolPerformanceMetrics {
  attendanceRate: number;
  regionalAttendanceAvg: number;
  gradeAvg: number;
  regionalGradeAvg: number;
}
