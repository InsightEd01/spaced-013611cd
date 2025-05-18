import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/sonner';
import ProtectedRoute from '@/components/ProtectedRoute';
import MainLayout from '@/components/layouts/MainLayout';

// Pages
import Login from '@/pages/Login';
import ParentSignup from '@/pages/ParentSignup';
import NotFound from '@/pages/NotFound';

// Admin Pages
import SupaAdminDashboard from '@/pages/admin/SupaAdminDashboard';
import AdminDashboard from '@/pages/admin/AdminDashboard';

// Parent Pages
import ParentDashboard from '@/pages/parent/ParentDashboard';

// Teacher Pages
import TeacherDashboard from '@/pages/teacher/TeacherDashboard';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<ParentSignup />} />
          
          {/* Protected Routes - Supa Admin */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute allowedRoles={['supa_admin']}>
                <MainLayout>
                  <Routes>
                    <Route path="dashboard" element={<SupaAdminDashboard />} />
                    {/* Add more admin routes */}
                  </Routes>
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* Protected Routes - School Admin */}
          <Route
            path="/school/*"
            element={
              <ProtectedRoute allowedRoles={['school_admin']}>
                <MainLayout>
                  <Routes>
                    <Route path="dashboard" element={<AdminDashboard />} />
                    {/* Add more school admin routes */}
                  </Routes>
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* Protected Routes - Teacher */}
          <Route
            path="/teacher/*"
            element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <MainLayout>
                  <Routes>
                    <Route path="dashboard" element={<TeacherDashboard />} />
                    {/* Add more teacher routes */}
                  </Routes>
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* Protected Routes - Parent */}
          <Route
            path="/parent/*"
            element={
              <ProtectedRoute allowedRoles={['parent']}>
                <MainLayout>
                  <Routes>
                    <Route path="dashboard" element={<ParentDashboard />} />
                    {/* Add more parent routes */}
                  </Routes>
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* 404 Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </Router>
  );
}

export default App;
