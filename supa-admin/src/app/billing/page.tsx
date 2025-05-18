import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Download,
  FileText,
  Filter,
} from 'lucide-react';
import Link from 'next/link';

// Mock data for demonstration
const subscriptionStats = {
  activeSubscriptions: 23,
  totalRevenue: 45600,
  averagePlanValue: 1982,
  upcomingRenewals: 5,
};

const subscriptions = [
  {
    id: '1',
    schoolName: 'International School of Excellence',
    plan: 'Enterprise',
    status: 'Active',
    nextBilling: '2025-06-15',
    amount: 2999,
  },
  {
    id: '2',
    schoolName: 'British Academy',
    plan: 'Premium',
    status: 'Warning',
    nextBilling: '2025-05-20',
    amount: 1999,
  },
  {
    id: '3',
    schoolName: 'Global Learning Center',
    plan: 'Basic',
    status: 'Overdue',
    nextBilling: '2025-05-10',
    amount: 999,
  },
];

export default function BillingPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Billing & Subscriptions</h1>
        <div className="flex gap-3">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" /> Filter
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" /> Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subscriptionStats.activeSubscriptions}</div>
            <Progress
              value={(subscriptionStats.activeSubscriptions / 30) * 100}
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${subscriptionStats.totalRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Monthly recurring</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Average Plan Value</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${subscriptionStats.averagePlanValue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Per school</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Upcoming Renewals</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subscriptionStats.upcomingRenewals}</div>
            <p className="text-xs text-muted-foreground">Next 30 days</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Subscription Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>School</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Next Billing</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscriptions.map((subscription) => (
                <TableRow key={subscription.id}>
                  <TableCell>
                    <Link
                      href={`/schools/${subscription.id}`}
                      className="font-medium hover:underline"
                    >
                      {subscription.schoolName}
                    </Link>
                  </TableCell>
                  <TableCell>{subscription.plan}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {subscription.status === 'Active' && (
                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                      )}
                      {subscription.status === 'Warning' && (
                        <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2" />
                      )}
                      {subscription.status === 'Overdue' && (
                        <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                      )}
                      {subscription.status}
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(subscription.nextBilling).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    ${subscription.amount.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableCaption>A list of all school subscriptions.</TableCaption>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
