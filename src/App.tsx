
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

import Login from "@/pages/Login";
import ParentSignup from "@/pages/ParentSignup";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import TeacherDashboard from "@/pages/teacher/TeacherDashboard";
import ParentDashboard from "@/pages/parent/ParentDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/parent-signup" element={<ParentSignup />} />
            
            {/* Admin Protected Routes */}
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Teacher Protected Routes */}
            <Route 
              path="/teacher/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['teacher']}>
                  <TeacherDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Parent Protected Routes */}
            <Route 
              path="/parent/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['parent']}>
                  <ParentDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Redirect to login as default route */}
            <Route path="/" element={<Login />} />
            <Route path="*" element={<Login />} />
          </Routes>
        </BrowserRouter>
        <Toaster />
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
