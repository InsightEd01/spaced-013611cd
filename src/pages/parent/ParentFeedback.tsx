
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import ParentLayout from '@/components/layouts/ParentLayout';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const ParentFeedback = () => {
  const { authState } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [feedbackType, setFeedbackType] = useState<'complaint' | 'suggestion'>('suggestion');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedStudentId) {
      toast.error('Please select a student');
      return;
    }
    
    if (!title.trim()) {
      toast.error('Please enter a title for your feedback');
      return;
    }
    
    if (!content.trim()) {
      toast.error('Please enter your feedback content');
      return;
    }
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('feedback')
        .insert([
          { 
            student_id: selectedStudentId,
            type: feedbackType,
            content: content,
            title: title,
            date: new Date().toISOString()
          }
        ]);
      
      if (error) throw error;
      
      toast.success('Feedback submitted successfully');
      setTitle('');
      setContent('');
      
      // Redirect to dashboard
      setTimeout(() => navigate('/parent/dashboard'), 1500);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error('Failed to submit feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ParentLayout title="Feedback">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Submit Feedback</h1>
          <p className="text-gray-500">
            Share your thoughts, suggestions, or concerns with the school
          </p>
        </div>
        
        <Card className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Feedback Form</CardTitle>
              <CardDescription>
                Your feedback helps us improve our services
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="student">Regarding Student</Label>
                <Select 
                  value={selectedStudentId} 
                  onValueChange={setSelectedStudentId}
                  required
                >
                  <SelectTrigger id="student">
                    <SelectValue placeholder="Select a student" />
                  </SelectTrigger>
                  <SelectContent>
                    {authState.studentIds?.map((id) => (
                      <SelectItem key={id} value={id}>
                        Student ID: {id}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">Feedback Type</Label>
                <Select 
                  value={feedbackType} 
                  onValueChange={(value: 'complaint' | 'suggestion') => setFeedbackType(value)}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select feedback type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="suggestion">Suggestion</SelectItem>
                    <SelectItem value="complaint">Complaint</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Brief title for your feedback"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="content">Your Feedback</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Please provide details about your feedback"
                  rows={5}
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Submitting...' : 'Submit Feedback'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </ParentLayout>
  );
};

export default ParentFeedback;
