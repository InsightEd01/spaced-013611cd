import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen, BarChart3, Bell, Upload, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">SchoolHub</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/school/login">
                <Button variant="outline">School Admin</Button>
              </Link>
              <Link to="/teacher/login">
                <Button variant="outline">Teacher</Button>
              </Link>
              <Link to="/login">
                <Button>Parent Login</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            Modern School Management
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Streamline your educational institution with our comprehensive management system. 
            Perfect for schools, teachers, and parents.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <Link to="/signup">
                <Button size="lg" className="w-full sm:w-auto">
                  Get Started as Parent
                </Button>
              </Link>
            </div>
            <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
              <Link to="/school/login">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  School Admin Portal
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900">
            Everything You Need to Manage Your School
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            Powerful features for administrators, teachers, and parents
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <Users className="h-8 w-8 text-blue-600 mb-2" />
              <CardTitle>Student Management</CardTitle>
              <CardDescription>
                Comprehensive student profiles, enrollment tracking, and class assignments
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <BarChart3 className="h-8 w-8 text-green-600 mb-2" />
              <CardTitle>Academic Tracking</CardTitle>
              <CardDescription>
                Monitor grades, attendance, and academic progress with detailed analytics
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Bell className="h-8 w-8 text-yellow-600 mb-2" />
              <CardTitle>Communication Hub</CardTitle>
              <CardDescription>
                Real-time notifications, announcements, and parent-teacher communication
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Upload className="h-8 w-8 text-purple-600 mb-2" />
              <CardTitle>File Management</CardTitle>
              <CardDescription>
                Secure document storage for student records, photos, and school files
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="h-8 w-8 text-red-600 mb-2" />
              <CardTitle>Role-Based Access</CardTitle>
              <CardDescription>
                Secure access control for administrators, teachers, and parents
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <BookOpen className="h-8 w-8 text-indigo-600 mb-2" />
              <CardTitle>Assessment Tools</CardTitle>
              <CardDescription>
                Create and manage tests, quizzes, and assessments with automated grading
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">
              Ready to Transform Your School?
            </h2>
            <p className="mt-4 text-lg text-blue-100">
              Join thousands of schools already using SchoolHub
            </p>
            <div className="mt-8 flex justify-center space-x-4">
              <Link to="/signup">
                <Button size="lg" variant="secondary">
                  Start Free Trial
                </Button>
              </Link>
              <Link to="/school/login">
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600">
                  Schedule Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-400">
            <p>&copy; 2024 SchoolHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
