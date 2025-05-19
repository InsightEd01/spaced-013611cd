
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import ParentLayout from '@/components/layouts/ParentLayout';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Loader2, PlusCircle, Trash2 } from 'lucide-react';

const ParentSettings = () => {
  const { authState, logout } = useAuth();
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [studentNumber, setStudentNumber] = useState('');
  const [linkedStudents, setLinkedStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [linkLoading, setLinkLoading] = useState(false);

  useEffect(() => {
    if (authState.user) {
      setEmail(authState.user.email || '');
      fetchLinkedStudents();
    }
  }, [authState.user]);

  const fetchLinkedStudents = async () => {
    try {
      setLoading(true);
      if (!authState.studentIds?.length) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('students')
        .select('id, first_name, last_name, student_number, class_name')
        .in('id', authState.studentIds);

      if (error) throw error;

      setLinkedStudents(data || []);
    } catch (error) {
      console.error('Error fetching linked students:', error);
      toast.error('Failed to load linked students');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setPasswordLoading(true);
      const { error } = await supabase.auth.updateUser({ password: newPassword });

      if (error) throw error;

      toast.success('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      console.error('Error updating password:', error);
      toast.error(error.message || 'Failed to update password');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleLinkStudent = async () => {
    if (!studentNumber.trim()) {
      toast.error('Please enter a student number');
      return;
    }

    try {
      setLinkLoading(true);

      // Check if student exists
      const { data: student, error: studentError } = await supabase
        .from('students')
        .select('id')
        .eq('student_number', studentNumber)
        .single();

      if (studentError || !student) {
        toast.error('Student not found with that number');
        setLinkLoading(false);
        return;
      }

      // Check if student is already linked
      if (authState.studentIds?.includes(student.id)) {
        toast.error('This student is already linked to your account');
        setLinkLoading(false);
        return;
      }

      // Update user metadata with new student ID
      const newStudentIds = [...(authState.studentIds || []), student.id];
      
      const { error: updateError } = await supabase.auth.updateUser({
        data: { student_ids: newStudentIds }
      });

      if (updateError) throw updateError;

      toast.success('Student linked successfully');
      setStudentNumber('');
      fetchLinkedStudents();
    } catch (error: any) {
      console.error('Error linking student:', error);
      toast.error(error.message || 'Failed to link student');
    } finally {
      setLinkLoading(false);
    }
  };

  const handleUnlinkStudent = async (studentId: string) => {
    try {
      setLoading(true);
      
      // Remove student from user's student_ids array
      const newStudentIds = authState.studentIds?.filter(id => id !== studentId) || [];
      
      const { error: updateError } = await supabase.auth.updateUser({
        data: { student_ids: newStudentIds }
      });

      if (updateError) throw updateError;

      toast.success('Student unlinked successfully');
      fetchLinkedStudents();
    } catch (error: any) {
      console.error('Error unlinking student:', error);
      toast.error(error.message || 'Failed to unlink student');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      // Redirect happens in AuthContext
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Failed to log out');
    }
  };

  return (
    <ParentLayout title="Settings">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Account Settings</h1>
          <p className="text-gray-500">
            Manage your account and linked students
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>Update your personal details and password</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={email} disabled className="bg-gray-50" />
                  <p className="text-xs text-gray-500">Email cannot be changed</p>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Change Password</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input
                      id="current-password"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                  
                  <Button 
                    onClick={handlePasswordChange} 
                    disabled={passwordLoading || !currentPassword || !newPassword || !confirmPassword}
                  >
                    {passwordLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating Password...
                      </>
                    ) : (
                      'Update Password'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Linked Students</CardTitle>
                <CardDescription>Manage the students linked to your account</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : linkedStudents.length > 0 ? (
                  <div className="space-y-4">
                    {linkedStudents.map((student) => (
                      <div 
                        key={student.id}
                        className="flex items-center justify-between p-4 border rounded-md"
                      >
                        <div>
                          <h3 className="font-medium">
                            {student.first_name} {student.last_name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            ID: {student.student_number} • Class: {student.class_name || 'None'}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUnlinkStudent(student.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Unlink
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-4 text-gray-500">No students linked to your account.</p>
                )}
              </CardContent>
              <CardFooter className="border-t pt-4 flex flex-col items-stretch gap-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter student ID number"
                    value={studentNumber}
                    onChange={(e) => setStudentNumber(e.target.value)}
                  />
                  <Button
                    onClick={handleLinkStudent}
                    disabled={linkLoading || !studentNumber.trim()}
                  >
                    {linkLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <PlusCircle className="h-4 w-4 mr-1" />
                        Link Student
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-xs text-gray-500">
                  Enter the student's unique ID number to link them to your account.
                </p>
              </CardFooter>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Session</CardTitle>
                <CardDescription>Manage your current session</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={handleLogout} variant="destructive" className="w-full">
                  Log Out
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ParentLayout>
  );
};

export default ParentSettings;
