
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Mail, Send, Settings, Users, CheckCircle } from 'lucide-react';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  type: 'announcement' | 'attendance' | 'grade' | 'general';
}

interface EmailSettings {
  enableNotifications: boolean;
  attendanceAlerts: boolean;
  gradeAlerts: boolean;
  announcementAlerts: boolean;
}

export default function EmailNotificationSystem() {
  const [emailSettings, setEmailSettings] = useState<EmailSettings>({
    enableNotifications: true,
    attendanceAlerts: true,
    gradeAlerts: true,
    announcementAlerts: true
  });
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [customSubject, setCustomSubject] = useState('');
  const [customBody, setCustomBody] = useState('');
  const [recipients, setRecipients] = useState<string>('all_parents');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmailSettings();
    fetchEmailTemplates();
  }, []);

  const fetchEmailSettings = async () => {
    try {
      // In a real app, this would fetch user-specific settings
      setEmailSettings({
        enableNotifications: true,
        attendanceAlerts: true,
        gradeAlerts: true,
        announcementAlerts: true
      });
    } catch (error) {
      console.error('Error fetching email settings:', error);
      toast.error('Failed to load email settings');
    }
  };

  const fetchEmailTemplates = async () => {
    try {
      // Sample templates - in a real app, these would be stored in the database
      const sampleTemplates: EmailTemplate[] = [
        {
          id: '1',
          name: 'Attendance Alert',
          subject: 'Student Attendance Alert - {student_name}',
          body: 'Dear Parent,\n\nThis is to inform you that {student_name} was marked as {status} on {date}.\n\nBest regards,\n{school_name}',
          type: 'attendance'
        },
        {
          id: '2',
          name: 'Grade Notification',
          subject: 'New Grade Posted - {subject}',
          body: 'Dear Parent,\n\nA new grade has been posted for {student_name} in {subject}.\n\nGrade: {grade}\nAssessment: {assessment_name}\n\nBest regards,\n{school_name}',
          type: 'grade'
        },
        {
          id: '3',
          name: 'General Announcement',
          subject: 'School Announcement - {title}',
          body: 'Dear Parents,\n\n{content}\n\nBest regards,\n{school_name}',
          type: 'announcement'
        }
      ];
      
      setTemplates(sampleTemplates);
    } catch (error) {
      console.error('Error fetching email templates:', error);
      toast.error('Failed to load email templates');
    } finally {
      setLoading(false);
    }
  };

  const updateEmailSettings = async (newSettings: Partial<EmailSettings>) => {
    try {
      const updatedSettings = { ...emailSettings, ...newSettings };
      setEmailSettings(updatedSettings);
      
      // In a real app, save to database
      toast.success('Email settings updated');
    } catch (error) {
      console.error('Error updating email settings:', error);
      toast.error('Failed to update email settings');
    }
  };

  const sendEmail = async () => {
    if (!customSubject.trim() || !customBody.trim()) {
      toast.error('Please fill in subject and message');
      return;
    }

    setSending(true);
    try {
      // Call the send-email edge function
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: {
          subject: customSubject,
          body: customBody,
          recipients: recipients,
          template_id: selectedTemplate || null
        }
      });

      if (error) throw error;

      toast.success('Email sent successfully');
      setCustomSubject('');
      setCustomBody('');
      setSelectedTemplate('');
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('Failed to send email');
    } finally {
      setSending(false);
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(templateId);
      setCustomSubject(template.subject);
      setCustomBody(template.body);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Email Notification System</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Loading email system...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Email Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Email Notification Settings
          </CardTitle>
          <CardDescription>
            Configure automatic email notifications for different events
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Turn on/off all email notifications
              </p>
            </div>
            <Switch
              checked={emailSettings.enableNotifications}
              onCheckedChange={(checked) => 
                updateEmailSettings({ enableNotifications: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Attendance Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Notify parents when students are absent or late
              </p>
            </div>
            <Switch
              checked={emailSettings.attendanceAlerts}
              onCheckedChange={(checked) => 
                updateEmailSettings({ attendanceAlerts: checked })
              }
              disabled={!emailSettings.enableNotifications}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Grade Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Notify parents when new grades are posted
              </p>
            </div>
            <Switch
              checked={emailSettings.gradeAlerts}
              onCheckedChange={(checked) => 
                updateEmailSettings({ gradeAlerts: checked })
              }
              disabled={!emailSettings.enableNotifications}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Announcement Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Notify parents about school announcements
              </p>
            </div>
            <Switch
              checked={emailSettings.announcementAlerts}
              onCheckedChange={(checked) => 
                updateEmailSettings({ announcementAlerts: checked })
              }
              disabled={!emailSettings.enableNotifications}
            />
          </div>
        </CardContent>
      </Card>

      {/* Send Email */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Send Email
          </CardTitle>
          <CardDescription>
            Send custom emails to parents and students
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="template">Email Template</Label>
              <Select value={selectedTemplate} onValueChange={handleTemplateSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a template (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      <div className="flex items-center gap-2">
                        <span>{template.name}</span>
                        <Badge variant="outline">{template.type}</Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="recipients">Recipients</Label>
              <Select value={recipients} onValueChange={setRecipients}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all_parents">All Parents</SelectItem>
                  <SelectItem value="all_teachers">All Teachers</SelectItem>
                  <SelectItem value="specific_class">Specific Class</SelectItem>
                  <SelectItem value="specific_students">Specific Students</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={customSubject}
              onChange={(e) => setCustomSubject(e.target.value)}
              placeholder="Email subject"
            />
          </div>

          <div>
            <Label htmlFor="body">Message</Label>
            <Textarea
              id="body"
              value={customBody}
              onChange={(e) => setCustomBody(e.target.value)}
              placeholder="Email message"
              rows={6}
            />
            <p className="text-sm text-muted-foreground mt-2">
              You can use placeholders like {'{student_name}'}, {'{school_name}'}, {'{date}'} in your message
            </p>
          </div>

          <Button 
            onClick={sendEmail} 
            disabled={sending || !emailSettings.enableNotifications}
            className="w-full"
          >
            {sending ? (
              <>
                <Mail className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send Email
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Email Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Email Templates</CardTitle>
          <CardDescription>
            Pre-configured email templates for common communications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {templates.map((template) => (
              <div key={template.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{template.name}</h4>
                  <Badge variant="outline">{template.type}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {template.subject}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleTemplateSelect(template.id)}
                >
                  Use Template
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
