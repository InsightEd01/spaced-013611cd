# Comprehensive School Management System Development Guide

This document provides a detailed guide for developing a school management system using React for the frontend and Supabase for the backend and database. It includes a separate Supa Admin system, implemented as a distinct application using Next.js, to oversee multiple schools. The guide outlines all pages, their functions, and the system workflow, ensuring that only school admins can create teacher accounts and that parents have a dedicated sign-up/login page where they can link multiple students. The system is mobile-optimized for teachers and parents, supporting enrollment, academic management, communication, attendance tracking, feedback submission, and multi-school oversight.

## 1. Introduction

### 1.1 System Overview
The school management system is a web-based platform designed to streamline administrative, academic, and communication processes within a school. It serves four primary user roles: Supa Admins, school admins, teachers, and parents, with the Supa Admin role overseeing multiple schools. Key features include:
- Enrollment of teachers, students, classes, and subjects.
- Uploading and viewing test and exam results.
- Parent dashboards for monitoring student performance, announcements, and attendance.
- Teacher tools for posting announcements and marking attendance.
- Feedback submission for parents.
- Mobile-optimized interfaces for teachers and parents.
- Supa Admin system for managing multiple schools, subscriptions, and compliance.

### 1.2 Purpose and Goals
- **Purpose**: To create an efficient, secure, and user-friendly system that simplifies school management while enhancing transparency and accessibility across multiple schools.
- **Goals**:
  - Centralize enrollment and academic data management.
  - Facilitate real-time communication between teachers and parents.
  - Ensure secure, role-based access to sensitive data.
  - Provide a responsive, mobile-friendly experience for teachers and parents.
  - Enable system-wide oversight and analytics for multiple schools.

### 1.3 Technology Stack
- **School Management System**:
  - **Frontend**: React with Tailwind CSS for responsive, mobile-optimized design.
  - **Backend and Database**: Supabase (PostgreSQL, Auth, Storage).
  - **Authentication**: Supabase Auth with custom role-based access control.
- **Supa Admin System**:
  - **Frontend**: Next.js (React) with Tailwind CSS.
  - **Backend**: Supabase (same database as school system) with Next.js API routes.
  - **Additional Libraries**: React-Leaflet for maps, Recharts/D3.js for analytics, TanStack Table for data tables, PDFKit/React-PDF for reports.
- **Mobile Optimization**: Tailwind CSS ensures touch-friendly, responsive layouts for teacher and parent interfaces.

## 2. User Roles and Permissions

The system supports four user roles, each with specific responsibilities and permissions:

### 2.1 Supa Admin
- **Responsibilities**:
  - Create, edit, and delete school profiles.
  - Assign School Admins to schools.
  - Manage subscriptions and billing for schools.
  - View cross-school analytics and ensure compliance.
- **Permissions**:
  - Full access to all schools and system-wide data.
  - Can create, update, and delete records in `schools`, `subscriptions`, and `audit_logs` tables.
  - Can manage Supa Admins and School Admins.

### 2.2 School Admin
- **Responsibilities**:
  - Create and manage teacher accounts (teachers cannot sign up themselves).
  - Create and manage classes and subjects.
  - Assign teachers to classes (multiple teachers per class allowed).
- **Permissions**:
  - Full access to their school’s data.
  - Can create, update, and delete records for teachers, classes, and subjects within their school.
  - Can manage class-teacher assignments.

### 2.3 Teachers
- **Responsibilities**:
  - Enroll students into their assigned classes and assign subjects.
  - Upload test and exam results.
  - Post announcements and notifications for their classes.
  - Mark attendance for their classes.
- **Permissions**:
  - Access data only for their assigned classes.
  - Can create, update, and delete records for students, subjects, assessments, announcements, and attendance within their classes.
  - Cannot sign up; must use admin-created accounts.

### 2.4 Parents
- **Responsibilities**:
  - Sign up via a separate page and link multiple students to their account.
  - Log in using email/password to view their children’s data.
  - View their children’s test/exam results, performance, announcements, notifications, and attendance.
  - Submit complaints or suggestions.
- **Permissions**:
  - Read-only access to their children’s data.
  - Can submit feedback (complaints or suggestions).
  - Cannot modify or delete any data.

## 3. List of Pages and Functions

The system comprises **13 pages**: seven for school-level operations and six for the Supa Admin system. Below is a detailed list of each page, its functions, and its integration into the system workflow.

| **Page**                  | **User Role**       | **Functions**                                                                 | **Workflow Integration**                                                                 |
|---------------------------|---------------------|------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------|
| **Login Page**            | All (Supa Admins, School Admins, Teachers, Parents) | - Authenticate users with email/password.<br>- Redirect to respective dashboards based on role. | - Entry point for all users.<br>- Validates credentials and directs to appropriate dashboard. |
| **Parent Sign-Up Page**   | Parents             | - Allow parents to create an account.<br>- Link multiple students using student IDs or names. | - Parents sign up and link students.<br>- After sign-up, they log in to access the Parent Dashboard. |
| **Admin Dashboard**       | School Admins       | - Create and manage teacher accounts.<br>- Create and manage classes.<br>- Create and manage subjects.<br>- Assign teachers to classes. | - Admins set up the school structure.<br>- Enables teacher workflows by creating accounts and assignments. |
| **Teacher Dashboard**     | Teachers            | - Enroll students into assigned classes.<br>- Assign subjects to students.<br>- Upload test/exam results.<br>- Post announcements.<br>- Mark attendance. | - Teachers manage classes and academic tasks.<br>- Data is visible to parents via the Parent Dashboard. |
| **Parent Dashboard**      | Parents             | - View children’s test/exam results, performance, announcements, and attendance.<br>- Submit feedback.<br>- Manage linked students (add/remove). | - Parents monitor their children’s progress.<br>- Supports multiple students for comprehensive monitoring. |
| **Attendance Tracking Page** | Teachers, Parents | - Teachers: Mark attendance (present, absent, late) for a class and date.<br>- Parents: View children’s attendance history (last 30 days). | - Teachers record attendance, accessible to parents.<br>- Integrated into dashboards for seamless access. |
| **Feedback Submission Page** | Parents           | - Submit complaints or suggestions via a form.                              | - Part of the Parent Dashboard, enabling parent-school communication. |
| **Multi-School Dashboard** | Supa Admins        | - View all schools with map and metrics.<br>- Add new schools.<br>- Generate reports. | - Supa Admins oversee all schools.<br>- Initiates school creation and monitoring workflows. |
| **School Management**     | Supa Admins        | - Edit school details.<br>- Manage subscriptions.<br>- View performance metrics.<br>- Deactivate/delete schools. | - Manages individual school profiles and subscriptions.<br>- Ensures operational continuity. |
| **User Management**       | Supa Admins        | - Add Supa Admins.<br>- Manage School Admins.<br>- View activity logs.       | - Controls system-wide user access.<br>- Ensures proper admin assignments. |
| **Analytics Hub**         | Supa Admins        | - Analyze cross-school attendance and grades.<br>- Export reports.          | - Provides system-wide insights.<br>- Supports data-driven decisions. |
| **Billing & Subscriptions** | Supa Admins      | - Manage school subscription plans.<br>- Track payment history.<br>- Send alerts. | - Handles financial aspects of school operations.<br>- Ensures subscription compliance. |
| **Audit Logs**            | Supa Admins        | - Track system-wide actions.<br>- Filter and export logs.                   | - Ensures accountability and compliance.<br>- Tracks all Supa Admin actions. |

### 3.1 Notes on Pages
- The **Login Page** serves all users, but parents use a separate **Parent Sign-Up Page** (accessible via a distinct link) for clarity.
- The **Attendance Tracking Page** and **Feedback Submission Page** are integrated into the Teacher and Parent Dashboards but listed separately for their distinct functionalities.
- Teacher and parent pages are mobile-optimized using Tailwind CSS, ensuring touch-friendly interfaces and responsive layouts.
- The Supa Admin system is a separate Next.js app with its own pages, accessible only to users with the `supa_admin` role, using the same Supabase database.

## 4. System Workflow

The system workflow outlines user interactions, ensuring role-based access and data integrity.

### 4.1 Supa Admin Workflow
1. **Login**: Supa Admins log in via the Login Page using email/password or SSO.
2. **School Management**:
   - Use the Multi-School Dashboard to create new schools, entering name, region, and subscription plan.
   - Assign School Admins via email invitations.
   - Manage subscriptions and billing in the Billing & Subscriptions page.
3. **Analytics and Compliance**:
   - Analyze cross-school data in the Analytics Hub.
   - Monitor actions via the Audit Logs page.
4. **Outcome**: Supa Admins oversee all schools, ensuring operational and financial compliance.

### 4.2 School Admin Workflow
1. **Login**: School Admins log in via the Login Page.
2. **Setup**:
   - Use the Admin Dashboard to create teacher accounts (email, password, name).
   - Create classes and subjects.
   - Assign teachers to classes.
3. **Outcome**: Teachers gain access, and the school structure is established.

### 4.3 Teacher Workflow
1. **Login**: Teachers log in using admin-provided credentials.
2. **Class Management**:
   - Enroll students, generating unique 10-digit IDs.
   - Assign subjects to students.
3. **Academic Management**:
   - Upload test/exam results.
   - Post announcements.
4. **Attendance**:
   - Mark daily attendance.
5. **Outcome**: Teachers manage classes, with data accessible to parents.

### 4.4 Parent Workflow
1. **Sign-Up**: Parents create accounts on the Parent Sign-Up Page, linking multiple students.
2. **Login**: Log in to access the Parent Dashboard.
3. **Monitoring**:
   - View children’s results, announcements, and attendance.
   - Add/remove linked students.
4. **Feedback**:
   - Submit complaints or suggestions.
5. **Outcome**: Parents stay informed and communicate with the school.

## 5. Database Schema

The system uses Supabase (PostgreSQL) with tables for school-level and Supa Admin operations.

| **Table Name**         | **Primary Key**         | **Columns**                                                                 | **Foreign Keys**                                                                 | **Description**                     |
|------------------------|-------------------------|-----------------------------------------------------------------------------|----------------------------------------------------------------------------------|-------------------------------------|
| `auth.users`           | `id` (UUID)             | `email` (text), `confirmed_at` (timestamp), `role` (text: 'supa_admin', 'admin', 'teacher', 'parent'), `student_ids` (UUID[]) | -                                                                               | Supabase Auth table with roles and parent student IDs |
| `schools`              | `id` (UUID)             | `name` (text), `region` (text), `subscription_plan` (text: 'basic', 'premium'), `created_at` (timestamptz), `supa_admin_id` (UUID) | `supa_admin_id` → `auth.users(id)`                                              | Stores school metadata             |
| `subscriptions`         | `id` (UUID)             | `school_id` (UUID), `plan` (text), `status` (text: 'active', 'expired', 'suspended'), `renewal_date` (date) | `school_id` → `schools(id)`                                                     | Tracks school billing              |
| `audit_logs`           | `id` (UUID)             | `action` (text), `supa_admin_id` (UUID), `target_school_id` (UUID), `timestamp` (timestamptz) | `supa_admin_id` → `auth.users(id)`, `target_school_id` → `schools(id)`          | Logs Supa Admin actions            |
| `Teachers`             | `teacher_id` (UUID)     | `user_id` (UUID), `name` (text), `school_id` (UUID)                         | `user_id` → `auth.users(id)`, `school_id` → `schools(id)`                       | Stores teacher information         |
| `Classes`              | `class_id` (UUID)       | `class_name` (text), `school_id` (UUID)                                    | `school_id` → `schools(id)`                                                     | Stores class details               |
| `Subjects`             | `subject_id` (UUID)     | `subject_name` (text), `school_id` (UUID)                                  | `school_id` → `schools(id)`                                                     | Stores subject details             |
| `Class_Teachers`       | -                       | `class_id` (UUID), `teacher_id` (UUID)                                     | `class_id` → `Classes(class_id)`, `teacher_id` → `Teachers(teacher_id)`         | Junction table for class-teacher assignments |
| `Students`             | `student_id` (UUID)     | `student_number` (char(10), unique), `name` (text), `class_id` (UUID), `school_id` (UUID) | `class_id` → `Classes(class_id)`, `school_id` → `schools(id)`                   | Stores student details             |
| `Student_Subjects`     | -                       | `student_id` (UUID), `subject_id` (UUID)                                   | `student_id` → `Students(student_id)`, `subject_id` → `Subjects(subject_id)`     | Junction table for student-subject assignments |
| `Assessments`          | `assessment_id` (UUID)  | `subject_id` (UUID), `assessment_type` (text: 'test', 'exam'), `assessment_name` (text), `date` (date), `max_score` (integer) | `subject_id` → `Subjects(subject_id)`                                           | Stores test/exam details           |
| `Assessment_Scores`    | -                       | `assessment_id` (UUID), `student_id` (UUID), `score` (integer)             | `assessment_id` → `Assessments(assessment_id)`, `student_id` → `Students(student_id)` | Stores student scores              |
| `Announcements`        | `announcement_id` (UUID) | `teacher_id` (UUID), `class_id` (UUID), `title` (text), `content` (text), `date` (date) | `teacher_id` → `Teachers(teacher_id)`, `class_id` → `Classes(class_id)`         | Stores announcements               |
| `Feedback`             | `feedback_id` (UUID)    | `student_id` (UUID), `type` (text: 'complaint', 'suggestion'), `content` (text), `date` (date) | `student_id` → `Students(student_id)`                                           | Stores parent feedback             |
| `Attendance`           | `attendance_id` (UUID)  | `student_id` (UUID), `class_id` (UUID), `date` (date), `status` (text: 'present', 'absent', 'late') | `student_id` → `Students(student_id)`, `class_id` → `Classes(class_id)`         | Stores attendance records          |

### 5.1 Notes on Schema
- The `auth.users` table includes a `student_ids` array for parents and a `role` column supporting `supa_admin`.
- The `schools`, `subscriptions`, and `audit_logs` tables support Supa Admin functions.
- A `school_id` column is added to school-specific tables for data isolation.
- The `student_number` is a unique 10-digit ID, auto-generated during enrollment.

## 6. Supa Admin System: Comprehensive Details

This section outlines the Supa Admin interface, workflows, security, and technical specifications. The Supa Admin oversees multiple schools, manages subscriptions, and ensures system-wide compliance.

### 6.1 Supa Admin System Overview
- **Purpose**: Manage multiple schools, users, subscriptions, and analytics.
- **Access**: Restricted to users with `role = 'supa_admin'` in `auth.users`.
- **Tech Stack**:
  - **Frontend**: Next.js (React) with Tailwind CSS.
  - **Backend**: Supabase (PostgreSQL, Auth, Storage).
  - **APIs**: Next.js API routes for Supa Admin-specific logic.

### 6.2 User Roles & Permissions
| **Role**      | **Permissions**                                                                                   |
|---------------|---------------------------------------------------------------------------------------------------|
| **Supa Admin**| - Create/edit/delete schools. <br> - Assign School Admins. <br> - View cross-school analytics. <br> - Manage billing/subscriptions. |

### 6.3 Database Schema Updates
The `schools`, `subscriptions`, and `audit_logs` tables (see Section 5) are added to support Supa Admin functions. All school-specific tables include a `school_id` foreign key.

### 6.4 Authentication & Security
#### Login Flow
1. Supa Admins log in via email/password or SSO.
2. Supabase Auth issues a JWT with:
   ```json
   {
     "role": "supa_admin",
     "school_id": null
   }
   ```

#### Row-Level Security (RLS) Policies
```sql
CREATE POLICY "Supa Admin schools access" ON schools
FOR ALL USING (auth.uid() IN (SELECT id FROM auth.users WHERE role = 'supa_admin'));

CREATE POLICY "Supa Admin subscriptions access" ON subscriptions
FOR ALL USING (auth.uid() IN (SELECT id FROM auth.users WHERE role = 'supa_admin'));
```

### 6.5 Supa Admin Pages/UI
#### Page 1: Multi-School Dashboard
- **URL**: `/supa-admin/dashboard`
- **Description**: Overview of all schools.
- **Features**:
  - Map View: Schools plotted by region using React-Leaflet.
  - Summary Cards: Total schools, active subscriptions, average attendance.
  - School List Table: Sortable by name, region, subscription status.
  - Quick Actions: Add School, Generate Report.

#### Page 2: School Management
- **URL**: `/supa-admin/schools/[school_id]`
- **Description**: Edit school details and subscriptions.
- **Features**:
  - School Info: Edit name, region, contact info.
  - Subscription Plan: Upgrade/downgrade (basic/premium).
  - Performance Metrics: Compare grades/attendance to regional averages.
  - Danger Zone: Deactivate/delete school.

#### Page 3: User Management
- **URL**: `/supa-admin/users`
- **Description**: Manage Supa Admins and School Admins.
- **Features**:
  - Add Supa Admin: Invite via email.
  - School Admin List: Filter by school, reset passwords.
  - Activity Logs: Last login times, actions.

#### Page 4: Analytics Hub
- **URL**: `/supa-admin/analytics`
- **Description**: Cross-school performance analysis.
- **Features**:
  - Attendance Trends: Line graph using Recharts.
  - Grade Comparisons: Bar chart by subject/region.
  - Data Export: CSV/PDF reports using PDFKit.

#### Page 5: Billing & Subscriptions
- **URL**: `/supa-admin/billing`
- **Description**: Manage payments and invoices.
- **Features**:
  - Subscription Overview: Active plans, renewal dates.
  - Payment History: Integration with Stripe.
  - Alerts: Notify schools of expiring subscriptions.

#### Page 6: Audit Logs
- **URL**: `/supa-admin/audit-logs`
- **Description**: Track system-wide actions.
- **Features**:
  - Filter Logs: By date, action type (e.g., “school_deleted”).
  - Export Logs: CSV for compliance audits.

### 6.6 API Endpoints
| **Endpoint**                | **Method** | **Description**                                  |
|-----------------------------|------------|--------------------------------------------------|
| `/api/supa-admin/schools`   | GET        | Fetch all schools (filter by region/plan).       |
| `/api/supa-admin/schools`   | POST       | Create a new school.                             |
| `/api/supa-admin/subscriptions` | PUT    | Update a school’s subscription plan.             |
| `/api/supa-admin/analytics` | GET        | Fetch cross-school performance data.             |
| `/api/supa-admin/audit-logs`| GET        | Retrieve audit logs (filter by date/action).     |

### 6.7 Workflows
#### Workflow 1: Onboard a New School
1. Navigate to Multi-School Dashboard, click Add School.
2. Enter school name, region, subscription plan.
3. Assign School Admin via email invitation.
4. System generates `school_id` for data linking.

#### Workflow 2: Resolve Subscription Issue
1. Receive alert about expired plan.
2. Navigate to Billing & Subscriptions, contact school.
3. Upgrade plan or suspend access.

### 6.8 Security & Compliance
- **Data Isolation**: `school_id` enforced via RLS.
- **GDPR Compliance**: Anonymize logs after 6 months; cascade parent data deletions.
- **Encryption**: Supabase column encryption for billing; HTTPS for APIs.

### 6.9 Edge Cases & Error Handling
- **Duplicate Schools**: Prevent via unique constraints.
- **School Deletion**: Soft-delete with 30-day admin notification.
- **Failed Payments**: Downgrade to basic tier after three failed attempts.

### 6.10 UI Wireframes
- **Multi-School Dashboard**: Map, summary cards, sortable table.
- **School Detail Page**: Edit form, subscription management, charts.
- **Audit Logs Page**: Filterable table with timestamp, action, user.

### 6.11 Tools & Libraries
- Charts: Recharts or D3.js.
- Maps: React-Leaflet with OpenStreetMap.
- Tables: TanStack Table.
- PDF Generation: PDFKit.

### 6.12 Addressing Common Challenges
To enhance the Supa Admin system’s appeal, it addresses common challenges in multi-school management:
- **System Integration**: Provides APIs and connectors for seamless integration with existing school systems.
- **Data Privacy and Security**: Implements encryption, role-based access controls, and regular audits to protect sensitive data, ensuring compliance with GDPR and FERPA.
- **User Adoption and Training**: Offers comprehensive training materials and support channels to facilitate user onboarding across multiple schools.
- **Scalability**: Leverages Supabase’s cloud-based infrastructure to handle large data volumes without performance issues.
- **Customization**: Allows flexible configurations to meet diverse school needs while maintaining centralized oversight.

## 7. Implementation Details

### 7.1 Frontend Development
- **School System**: React with Vite, Tailwind CSS.
- **Supa Admin System**: Next.js, Tailwind CSS.
- **Components**:
  - Login Page: Single entry for all users.
  - Parent Sign-Up Page: Form for account creation and student linking.
  - Dashboards: Role-specific interfaces.
- **Mobile Optimization**: Tailwind’s responsive classes, touch-friendly design.

### 7.2 Backend and Database Setup
- **Supabase Setup**: Create project, obtain URL and anon key, initialize tables.
- **Supabase Client**:
  ```javascript
  import { createClient } from '@supabase/supabase-js';
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  export const supabase = createClient(supabaseUrl, supabaseAnonKey);
  ```

### 7.3 Authentication
- **Supabase Auth**: Email/password or SSO.
- **Custom Columns**:
  ```sql
  ALTER TABLE auth.users ADD COLUMN role text;
  ALTER TABLE auth.users ADD COLUMN student_ids uuid[];
  ```

### 7.4 Row-Level Security (RLS)
- Enable RLS for all tables.
- Example Policies:
  ```sql
  CREATE POLICY "Parents view own children" ON public.students
  FOR SELECT TO authenticated
  USING (student_id = ANY((SELECT student_ids FROM auth.users WHERE id = auth.uid())));
  ```

### 7.5 Real-Time Features
- Use Supabase subscriptions for live updates:
  ```javascript
  supabase
    .channel('announcements')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'announcements' }, payload => {
      // Update state
    })
    .subscribe();
  ```

## 8. Sample Code

Below is a sample implementation of the Parent Sign-Up Page and Supa Admin Multi-School Dashboard.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>School Management System</title>
  <script src="https://cdn.jsdelivr.net/npm/react@18.2.0/umd/react.development.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/react-dom@18.2.0/umd/react-dom.development.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/@babel/standalone@7.20.15/babel.min.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
    const { useState, useEffect } = React;

    // Initialize Supabase client
    const supabase = Supabase.createClient('YOUR_SUPABASE_URL', 'YOUR_SUPABASE_ANON_KEY');

    // Parent Sign-Up Component
    function ParentSignUp({ onSignUp }) {
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      const [studentIds, setStudentIds] = useState(['']);
      const [error, setError] = useState('');

      const addStudentField = () => setStudentIds([...studentIds, '']);
      const updateStudentId = (index, value) => {
        const newIds = [...studentIds];
        newIds[index] = value;
        setStudentIds(newIds);
      };

      const handleSignUp = async () => {
        try {
          const { data: userData, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { role: 'parent', student_ids: [] } }
          });
          if (signUpError) throw signUpError;

          // Validate and link student IDs
          const validStudentIds = [];
          for (const studentNumber of studentIds) {
            if (studentNumber) {
              const { data: student } = await supabase
                .from('Students')
                .select('student_id')
                .eq('student_number', studentNumber)
                .single();
              if (student) validStudentIds.push(student.student_id);
            }
          }

          // Update user with student IDs
          await supabase.auth.updateUser({ data: { role: 'parent', student_ids: validStudentIds } });
          on