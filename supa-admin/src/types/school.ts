export interface School {
  id: string;
  name: string;
  region: string;
  latitude: number;
  longitude: number;
  subscriptionStatus: 'Active' | 'Trial' | 'Expired';
  totalStudents: number;
  totalTeachers?: number;
  totalClasses?: number;
  attendanceRate?: number;
  createdAt: string;
  updatedAt: string;
}
