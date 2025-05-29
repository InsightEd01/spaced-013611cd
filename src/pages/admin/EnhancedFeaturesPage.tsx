
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminLayout from '@/components/layouts/AdminLayout';
import FileUpload from '@/components/FileUpload';
import NotificationCenter from '@/components/NotificationCenter';
import AdvancedReporting from '@/components/AdvancedReporting';
import EmailNotificationSystem from '@/components/EmailNotificationSystem';

export default function EnhancedFeaturesPage() {
  const handleFileUpload = (url: string, fileName: string) => {
    console.log('File uploaded:', fileName, url);
  };

  return (
    <AdminLayout title="Enhanced Features">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Enhanced Features</h1>
          <p className="text-muted-foreground">
            Advanced tools for school management and communication
          </p>
        </div>

        <Tabs defaultValue="file-upload" className="space-y-6">
          <TabsList>
            <TabsTrigger value="file-upload">File Upload</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="reporting">Analytics</TabsTrigger>
            <TabsTrigger value="email">Email System</TabsTrigger>
          </TabsList>

          <TabsContent value="file-upload" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <FileUpload
                bucket="student-photos"
                path="photos"
                accept="image/*"
                maxSize={2 * 1024 * 1024}
                onUploadComplete={handleFileUpload}
                allowMultiple={true}
              />
              <FileUpload
                bucket="documents"
                path="school-documents"
                accept=".pdf,.doc,.docx,.txt"
                maxSize={10 * 1024 * 1024}
                onUploadComplete={handleFileUpload}
                allowMultiple={true}
              />
            </div>
          </TabsContent>

          <TabsContent value="notifications">
            <NotificationCenter />
          </TabsContent>

          <TabsContent value="reporting">
            <AdvancedReporting />
          </TabsContent>

          <TabsContent value="email">
            <EmailNotificationSystem />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
