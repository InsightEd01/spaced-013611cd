
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { School, CheckCircle2, AlertCircle } from 'lucide-react';

const ParentSignup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [studentNumber, setStudentNumber] = useState('');
  const [isStudentNumberValid, setIsStudentNumberValid] = useState<boolean | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signupComplete, setSignupComplete] = useState(false);
  const { signup, validateStudentNumber, authState } = useAuth();
  const navigate = useNavigate();

  const handleStudentNumberBlur = async () => {
    if (studentNumber.length === 10) {
      const isValid = await validateStudentNumber(studentNumber);
      setIsStudentNumberValid(isValid);
    } else {
      setIsStudentNumberValid(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      // Handle password mismatch
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await signup({ email, password, studentNumber });
      setSignupComplete(true);
      // Redirect to login after a delay
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      // Error is handled in the auth context
      console.error('Signup failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (signupComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-center">Signup Successful!</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="mb-4 flex justify-center">
              <CheckCircle2 className="h-16 w-16 text-green-500" />
            </div>
            <p className="mb-4">
              Thank you for registering. Please check your email to verify your account.
            </p>
            <p className="text-gray-600 text-sm">
              You will be redirected to the login page shortly...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 rounded-full bg-edu-blue flex items-center justify-center">
            <School className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Parent Registration</h2>
          <p className="mt-2 text-sm text-gray-600">
            Create an account to access your child's information
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Sign Up</CardTitle>
            <CardDescription>
              Create your parent account and link to your child
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
                {password && confirmPassword && password !== confirmPassword && (
                  <p className="text-edu-red text-sm">Passwords do not match</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="student-number">Student ID Number</Label>
                <div className="relative">
                  <Input
                    id="student-number"
                    type="text"
                    placeholder="10-digit student number"
                    value={studentNumber}
                    onChange={(e) => setStudentNumber(e.target.value)}
                    onBlur={handleStudentNumberBlur}
                    required
                    maxLength={10}
                    className="pr-10"
                  />
                  {isStudentNumberValid !== null && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      {isStudentNumberValid ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-edu-red" />
                      )}
                    </div>
                  )}
                </div>
                {isStudentNumberValid === false && (
                  <p className="text-edu-red text-sm">Student ID not found</p>
                )}
                <p className="text-xs text-gray-500">
                  Enter the 10-digit student ID provided by your child's school
                </p>
              </div>
              
              {authState.error && (
                <div className="text-edu-red text-sm pt-1">
                  {authState.error}
                </div>
              )}
              
              <Button
                type="submit"
                className="w-full bg-edu-blue hover:bg-blue-700"
                disabled={isSubmitting || (isStudentNumberValid === false)}
              >
                {isSubmitting ? 'Signing up...' : 'Sign Up'}
              </Button>
            </form>
          </CardContent>
          
          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-edu-blue hover:underline">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ParentSignup;
