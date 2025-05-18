
// Mock data for development purposes
import { v4 as uuidv4 } from 'uuid';

// Generate a random 10-digit student number
const generateStudentNumber = () => {
  return Math.floor(1000000000 + Math.random() * 9000000000).toString();
};

// Schools
export const mockSchools = [
  {
    id: uuidv4(),
    name: 'Springfield Elementary',
    region: 'North',
    subscription_plan: 'premium',
    created_at: new Date().toISOString(),
    supa_admin_id: uuidv4(),
  },
  {
    id: uuidv4(),
    name: 'Riverdale High',
    region: 'South',
    subscription_plan: 'basic',
    created_at: new Date().toISOString(),
    supa_admin_id: uuidv4(),
  },
];

// Classes
export const mockClasses = [
  {
    id: uuidv4(),
    class_name: 'Class 1A',
    school_id: mockSchools[0].id,
    created_at: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    class_name: 'Class 2B',
    school_id: mockSchools[0].id,
    created_at: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    class_name: 'Class 3C',
    school_id: mockSchools[1].id,
    created_at: new Date().toISOString(),
  },
];

// Teachers
export const mockTeachers = [
  {
    id: uuidv4(),
    user_id: uuidv4(),
    name: 'John Smith',
    school_id: mockSchools[0].id,
    created_at: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    user_id: uuidv4(),
    name: 'Jane Doe',
    school_id: mockSchools[0].id,
    created_at: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    user_id: uuidv4(),
    name: 'Robert Brown',
    school_id: mockSchools[1].id,
    created_at: new Date().toISOString(),
  },
];

// Class-Teacher assignments
export const mockClassTeachers = [
  {
    class_id: mockClasses[0].id,
    teacher_id: mockTeachers[0].id,
    created_at: new Date().toISOString(),
  },
  {
    class_id: mockClasses[1].id,
    teacher_id: mockTeachers[1].id,
    created_at: new Date().toISOString(),
  },
  {
    class_id: mockClasses[2].id,
    teacher_id: mockTeachers[2].id,
    created_at: new Date().toISOString(),
  },
];

// Subjects
export const mockSubjects = [
  {
    id: uuidv4(),
    subject_name: 'Mathematics',
    school_id: mockSchools[0].id,
    created_at: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    subject_name: 'Science',
    school_id: mockSchools[0].id,
    created_at: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    subject_name: 'English',
    school_id: mockSchools[1].id,
    created_at: new Date().toISOString(),
  },
];

// Students
export const mockStudents = [
  {
    id: uuidv4(),
    student_number: generateStudentNumber(),
    first_name: 'Alice',
    last_name: 'Johnson',
    class_id: mockClasses[0].id,
    school_id: mockSchools[0].id,
    created_at: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    student_number: generateStudentNumber(),
    first_name: 'Bob',
    last_name: 'Williams',
    class_id: mockClasses[0].id,
    school_id: mockSchools[0].id,
    created_at: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    student_number: generateStudentNumber(),
    first_name: 'Charlie',
    last_name: 'Brown',
    class_id: mockClasses[1].id,
    school_id: mockSchools[0].id,
    created_at: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    student_number: generateStudentNumber(),
    first_name: 'David',
    last_name: 'Miller',
    class_id: mockClasses[2].id,
    school_id: mockSchools[1].id,
    created_at: new Date().toISOString(),
  },
];

// Student-Subject assignments
export const mockStudentSubjects = [
  {
    student_id: mockStudents[0].id,
    subject_id: mockSubjects[0].id,
    created_at: new Date().toISOString(),
  },
  {
    student_id: mockStudents[0].id,
    subject_id: mockSubjects[1].id,
    created_at: new Date().toISOString(),
  },
  {
    student_id: mockStudents[1].id,
    subject_id: mockSubjects[0].id,
    created_at: new Date().toISOString(),
  },
  {
    student_id: mockStudents[3].id,
    subject_id: mockSubjects[2].id,
    created_at: new Date().toISOString(),
  },
];

// Assessments
export const mockAssessments = [
  {
    id: uuidv4(),
    subject_id: mockSubjects[0].id,
    assessment_type: 'test',
    assessment_name: 'Mid-term Math Test',
    date: new Date().toISOString().split('T')[0],
    max_score: 100,
    created_at: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    subject_id: mockSubjects[1].id,
    assessment_type: 'exam',
    assessment_name: 'Final Science Exam',
    date: new Date().toISOString().split('T')[0],
    max_score: 100,
    created_at: new Date().toISOString(),
  },
];

// Assessment Scores
export const mockAssessmentScores = [
  {
    assessment_id: mockAssessments[0].id,
    student_id: mockStudents[0].id,
    score: 85,
    created_at: new Date().toISOString(),
  },
  {
    assessment_id: mockAssessments[0].id,
    student_id: mockStudents[1].id,
    score: 78,
    created_at: new Date().toISOString(),
  },
  {
    assessment_id: mockAssessments[1].id,
    student_id: mockStudents[0].id,
    score: 92,
    created_at: new Date().toISOString(),
  },
];

// Announcements
export const mockAnnouncements = [
  {
    id: uuidv4(),
    teacher_id: mockTeachers[0].id,
    class_id: mockClasses[0].id,
    title: 'Math Test Next Week',
    content: 'Please prepare for the upcoming math test on Monday.',
    date: new Date().toISOString().split('T')[0],
    created_at: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    teacher_id: mockTeachers[1].id,
    class_id: mockClasses[1].id,
    title: 'Field Trip Permission',
    content: 'Please bring signed permission slips for the science museum trip.',
    date: new Date().toISOString().split('T')[0],
    created_at: new Date().toISOString(),
  },
];

// Attendance
export const mockAttendance = [
  {
    id: uuidv4(),
    student_id: mockStudents[0].id,
    class_id: mockClasses[0].id,
    date: new Date().toISOString().split('T')[0],
    status: 'present',
    created_at: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    student_id: mockStudents[1].id,
    class_id: mockClasses[0].id,
    date: new Date().toISOString().split('T')[0],
    status: 'absent',
    created_at: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    student_id: mockStudents[2].id,
    class_id: mockClasses[1].id,
    date: new Date().toISOString().split('T')[0],
    status: 'late',
    created_at: new Date().toISOString(),
  },
];

// Feedback
export const mockFeedback = [
  {
    id: uuidv4(),
    student_id: mockStudents[0].id,
    type: 'suggestion',
    content: 'I think we should have more interactive learning activities.',
    date: new Date().toISOString().split('T')[0],
    created_at: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    student_id: mockStudents[1].id,
    type: 'complaint',
    content: 'The classroom is too cold in the mornings.',
    date: new Date().toISOString().split('T')[0],
    created_at: new Date().toISOString(),
  },
];

// Helper function to populate Supabase with mock data
export const seedMockData = async (supabase: any) => {
  // Add schools
  await supabase.from('schools').upsert(mockSchools);
  
  // Add classes
  await supabase.from('classes').upsert(mockClasses);
  
  // Add teachers
  await supabase.from('teachers').upsert(mockTeachers);
  
  // Add class-teacher relationships
  await supabase.from('class_teachers').upsert(mockClassTeachers);
  
  // Add subjects
  await supabase.from('subjects').upsert(mockSubjects);
  
  // Add students
  await supabase.from('students').upsert(mockStudents);
  
  // Add student-subject relationships
  await supabase.from('student_subjects').upsert(mockStudentSubjects);
  
  // Add assessments
  await supabase.from('assessments').upsert(mockAssessments);
  
  // Add assessment scores
  await supabase.from('assessment_scores').upsert(mockAssessmentScores);
  
  // Add announcements
  await supabase.from('announcements').upsert(mockAnnouncements);
  
  // Add attendance records
  await supabase.from('attendance').upsert(mockAttendance);
  
  // Add feedback
  await supabase.from('feedback').upsert(mockFeedback);

  console.log('Mock data seeded successfully!');
};
