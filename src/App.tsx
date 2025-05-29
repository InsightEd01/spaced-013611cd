
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/sonner';
import ProtectedRoute from '@/components/ProtectedRoute';

// Pages
import Login from '@/pages/Login';
import ParentSignup from '@/pages/ParentSignup';
import NotFound from '@/pages/NotFound';
import Index from '@/pages/Index';
import SchoolAdminLogin from '@/pages/SchoolAdminLogin';
import TeacherLogin from '@/pages/TeacherLogin';

// Admin Pages
import SupaAdminDashboard from '@/pages/admin/SupaAdminDashboard';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import EnhancedFeaturesPage from '@/pages/admin/EnhancedFeaturesPage';

// Parent Pages
import ParentDashboard from '@/pages/parent/ParentDashboard';
import ParentAttendance from '@/pages/parent/ParentAttendance';
import ParentReports from '@/pages/parent/ParentReports';
import ParentAnnouncements from '@/pages/parent/ParentAnnouncements';
import ParentFeedback from '@/pages/parent/ParentFeedback';
import ParentSettings from '@/pages/parent/ParentSettings';

// Teacher Pages
import TeacherDashboard from '@/pages/teacher/TeacherDashboard';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<ParentSignup />} />
          <Route path="/school/login" element={<SchoolAdminLogin />} />
          <Route path="/teacher/login" element={<TeacherLogin />} />
          
          {/* Protected Routes - Supa Admin */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute allowedRoles={['supa_admin']}>
                <Routes>
                  <Route path="dashboard" element={<SupaAdminDashboard />} />
                  <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
                </Routes>
              </ProtectedRoute>
            }
          />

          {/* Protected Routes - School Admin */}
          <Route
            path="/school/*"
            element={
              <ProtectedRoute allowedRoles={['school_admin']}>
                <Routes>
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="enhanced-features" element={<EnhancedFeaturesPage />} />
                  {/* Add more school admin routes */}
                </Routes>
              </ProtectedRoute>
            }
          />

          {/* Protected Routes - Teacher */}
          <Route
            path="/teacher/*"
            element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <Routes>
                  <Route path="dashboard" element={<TeacherDashboard />} />
                  {/* Add more teacher routes */}
                </Routes>
              </ProtectedRoute>
            }
          />

          {/* Protected Routes - Parent */}
          <Route
            path="/parent/*"
            element={
              <ProtectedRoute allowedRoles={['parent']}>
                <Routes>
                  <Route path="dashboard" element={<ParentDashboard />} />
                  <Route path="attendance" element={<ParentAttendance />} />
                  <Route path="reports" element={<ParentReports />} />
                  <Route path="announcements" element={<ParentAnnouncements />} />
                  <Route path="feedback" element={<ParentFeedback />} />
                  <Route path="settings" element={<ParentSettings />} />
                </Routes>
              </ProtectedRoute>
            }
          />
          
          {/* 404 Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </Router>
  );
}

export default App;
