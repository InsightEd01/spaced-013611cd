import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { getSchool } from '@/lib/schools';
import SchoolForm from '@/components/schools/SchoolForm';
import SubscriptionForm from '@/components/schools/SubscriptionForm';
import AdminList from '@/components/schools/AdminList';
import SchoolMetrics from '@/components/schools/SchoolMetrics';
import DangerZone from '@/components/schools/DangerZone';
import { AlertTriangle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Manage School | School Management System',
  description: 'View and edit school details, manage subscriptions, and view performance metrics.',
};

interface SchoolDetailPageProps {
  params: {
    id: string;
  };
}

export default async function SchoolDetailPage({ params }: SchoolDetailPageProps) {
  let schoolData;
  try {
    schoolData = await getSchool(params.id);
  } catch (error) {
    notFound();
  }

  const { name, region, status, subscription_plan: subscriptionPlan, subscription } = schoolData;
  const isInactive = status === 'inactive';
  const isExpired = subscription?.status === 'expired';

  return (
    <>
      {(isInactive || isExpired) && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Warning</AlertTitle>
          <AlertDescription>
            {isInactive
              ? 'This school has been deactivated. All operations are suspended.'
              : 'The subscription for this school has expired. Some features may be limited.'}
          </AlertDescription>
        </Alert>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{name}</h1>
          <div className="flex gap-2 mt-1 items-center">
            <Badge variant="outline">{region}</Badge>
            <Badge variant={isInactive ? 'destructive' : 'default'}>{status}</Badge>
            <Badge variant={subscriptionPlan === 'premium' ? 'default' : 'secondary'}>
              {subscriptionPlan}
            </Badge>
          </div>
        </div>
      </div>

      <Tabs defaultValue="details" className="w-full">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
          <TabsTrigger value="admins">School Admins</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>School Information</CardTitle>
            </CardHeader>
            <CardContent>
              <SchoolForm school={schoolData} />
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Management Options</CardTitle>
            </CardHeader>
            <CardContent>
              <DangerZone schoolId={params.id} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscription">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Management</CardTitle>
            </CardHeader>
            <CardContent>
              <SubscriptionForm schoolId={params.id} subscription={subscription} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="admins">
          <Card>
            <CardHeader>
              <CardTitle>School Administrators</CardTitle>
            </CardHeader>
            <CardContent>
              <AdminList schoolId={params.id} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <SchoolMetrics schoolId={params.id} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
