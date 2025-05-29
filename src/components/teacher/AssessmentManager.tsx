
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Plus, BookOpen, Edit, Save } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface Assessment {
  id: string;
  assessment_name: string;
  assessment_type: string;
  date: string;
  max_score: number;
  subject_id: string;
  subjects?: { subject_name: string };
}

interface Subject {
  id: string;
  subject_name: string;
}

interface Student {
  id: string;
  first_name: string;
  last_name: string;
  student_number: string;
}

interface AssessmentScore {
  student_id: string;
  score: number;
  student?: Student;
}

export function AssessmentManager() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [scores, setScores] = useState<AssessmentScore[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isGradingDialogOpen, setIsGradingDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form state for creating assessments
  const [formData, setFormData] = useState({
    assessment_name: '',
    assessment_type: 'exam',
    date: new Date(),
    max_score: 100,
    subject_id: ''
  });

  useEffect(() => {
    fetchAssessments();
    fetchSubjects();
    fetchStudents();
  }, []);

  const fetchAssessments = async () => {
    try {
      const { data, error } = await supabase
        .from('assessments')
        .select(`
          *,
          subjects(subject_name)
        `)
        .order('date', { ascending: false });

      if (error) throw error;
      setAssessments(data || []);
    } catch (error) {
      console.error('Error fetching assessments:', error);
      toast.error('Failed to load assessments');
    }
  };

  const fetchSubjects = async () => {
    try {
      const { data, error } = await supabase
        .from('subjects')
        .select('id, subject_name')
        .order('subject_name');

      if (error) throw error;
      setSubjects(data || []);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const fetchStudents = async () => {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('id, first_name, last_name, student_number')
        .order('first_name');

      if (error) throw error;
      setStudents(data || []);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const createAssessment = async () => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('assessments')
        .insert({
          assessment_name: formData.assessment_name,
          assessment_type: formData.assessment_type,
          date: format(formData.date, 'yyyy-MM-dd'),
          max_score: formData.max_score,
          subject_id: formData.subject_id
        });

      if (error) throw error;

      toast.success('Assessment created successfully');
      setIsCreateDialogOpen(false);
      setFormData({
        assessment_name: '',
        assessment_type: 'exam',
        date: new Date(),
        max_score: 100,
        subject_id: ''
      });
      fetchAssessments();
    } catch (error) {
      console.error('Error creating assessment:', error);
      toast.error('Failed to create assessment');
    } finally {
      setLoading(false);
    }
  };

  const openGradingDialog = async (assessment: Assessment) => {
    setSelectedAssessment(assessment);
    setIsGradingDialogOpen(true);

    try {
      // Fetch existing scores for this assessment
      const { data: scoresData, error } = await supabase
        .from('assessment_scores')
        .select(`
          student_id,
          score,
          students(id, first_name, last_name, student_number)
        `)
        .eq('assessment_id', assessment.id);

      if (error) throw error;

      // Create scores array with all students
      const existingScores = scoresData || [];
      const allScores = students.map(student => {
        const existingScore = existingScores.find(s => s.student_id === student.id);
        return {
          student_id: student.id,
          score: existingScore?.score || 0,
          student: student
        };
      });

      setScores(allScores);
    } catch (error) {
      console.error('Error fetching scores:', error);
      toast.error('Failed to load scores');
    }
  };

  const updateScore = (studentId: string, score: number) => {
    setScores(prev => 
      prev.map(s => 
        s.student_id === studentId 
          ? { ...s, score }
          : s
      )
    );
  };

  const saveScores = async () => {
    if (!selectedAssessment) return;

    try {
      setLoading(true);

      // Delete existing scores
      await supabase
        .from('assessment_scores')
        .delete()
        .eq('assessment_id', selectedAssessment.id);

      // Insert new scores
      const scoresData = scores.map(score => ({
        assessment_id: selectedAssessment.id,
        student_id: score.student_id,
        score: score.score
      }));

      const { error } = await supabase
        .from('assessment_scores')
        .insert(scoresData);

      if (error) throw error;

      toast.success('Scores saved successfully');
      setIsGradingDialogOpen(false);
    } catch (error) {
      console.error('Error saving scores:', error);
      toast.error('Failed to save scores');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Assessment Manager
              </CardTitle>
              <CardDescription>
                Create assessments and manage grades
              </CardDescription>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Assessment
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Assessment</DialogTitle>
                  <DialogDescription>
                    Set up a new assessment for your students
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Assessment Name</Label>
                    <Input
                      id="name"
                      value={formData.assessment_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, assessment_name: e.target.value }))}
                      placeholder="Enter assessment name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">Assessment Type</Label>
                    <Select
                      value={formData.assessment_type}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, assessment_type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="exam">Exam</SelectItem>
                        <SelectItem value="quiz">Quiz</SelectItem>
                        <SelectItem value="assignment">Assignment</SelectItem>
                        <SelectItem value="project">Project</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Select
                      value={formData.subject_id}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, subject_id: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map((subject) => (
                          <SelectItem key={subject.id} value={subject.id}>
                            {subject.subject_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {format(formData.date, 'PPP')}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={formData.date}
                            onSelect={(date) => date && setFormData(prev => ({ ...prev, date }))}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div>
                      <Label htmlFor="maxScore">Max Score</Label>
                      <Input
                        id="maxScore"
                        type="number"
                        value={formData.max_score}
                        onChange={(e) => setFormData(prev => ({ ...prev, max_score: parseInt(e.target.value) }))}
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={createAssessment} disabled={loading}>
                    {loading ? 'Creating...' : 'Create Assessment'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {assessments.map((assessment) => (
              <div key={assessment.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">{assessment.assessment_name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline">{assessment.assessment_type}</Badge>
                    <span className="text-sm text-muted-foreground">
                      {assessment.subjects?.subject_name}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(assessment.date), 'MMM dd, yyyy')}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      Max: {assessment.max_score}
                    </span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={() => openGradingDialog(assessment)}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Grade
                </Button>
              </div>
            ))}
            {assessments.length === 0 && (
              <p className="text-center py-8 text-muted-foreground">
                No assessments created yet
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Grading Dialog */}
      <Dialog open={isGradingDialogOpen} onOpenChange={setIsGradingDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              Grade: {selectedAssessment?.assessment_name}
            </DialogTitle>
            <DialogDescription>
              Enter scores for each student (Max: {selectedAssessment?.max_score})
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-96 overflow-y-auto space-y-2">
            {scores.map((score) => (
              <div key={score.student_id} className="flex items-center justify-between p-3 border rounded">
                <div>
                  <p className="font-medium">
                    {score.student?.first_name} {score.student?.last_name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    ID: {score.student?.student_number}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="0"
                    max={selectedAssessment?.max_score}
                    value={score.score}
                    onChange={(e) => updateScore(score.student_id, parseInt(e.target.value) || 0)}
                    className="w-20"
                  />
                  <span className="text-sm text-muted-foreground">
                    / {selectedAssessment?.max_score}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button onClick={saveScores} disabled={loading}>
              <Save className="mr-2 h-4 w-4" />
              {loading ? 'Saving...' : 'Save Scores'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
