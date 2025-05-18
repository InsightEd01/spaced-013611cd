import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Download,
  Filter,
  School,
  UserPlus,
  Settings,
  AlertTriangle,
  FileText,
} from 'lucide-react';

// Mock data for demonstration
const auditLogs = [
  {
    id: '1',
    timestamp: '2025-05-18T14:30:00Z',
    action: 'school_created',
    supaAdmin: 'john.doe@admin.com',
    targetSchool: 'International School of Excellence',
    details: 'Created new school profile',
    severity: 'info',
  },
  {
    id: '2',
    timestamp: '2025-05-18T13:15:00Z',
    action: 'subscription_updated',
    supaAdmin: 'jane.smith@admin.com',
    targetSchool: 'British Academy',
    details: 'Upgraded to Premium plan',
    severity: 'info',
  },
  {
    id: '3',
    timestamp: '2025-05-18T12:45:00Z',
    action: 'school_deactivated',
    supaAdmin: 'john.doe@admin.com',
    targetSchool: 'Global Learning Center',
    details: 'Deactivated due to payment issues',
    severity: 'warning',
  },
];

const actionIcons: { [key: string]: React.ReactNode } = {
  school_created: <School className="h-4 w-4" />,
  subscription_updated: <FileText className="h-4 w-4" />,
  school_deactivated: <AlertTriangle className="h-4 w-4" />,
  user_added: <UserPlus className="h-4 w-4" />,
  settings_updated: <Settings className="h-4 w-4" />,
};

const severityColors: { [key: string]: string } = {
  info: 'text-blue-600',
  warning: 'text-yellow-600',
  error: 'text-red-600',
};

export default function AuditLogsPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Audit Logs</h1>
        <div className="flex gap-3">
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actions</SelectItem>
              <SelectItem value="school_created">School Created</SelectItem>
              <SelectItem value="subscription_updated">Subscription Updated</SelectItem>
              <SelectItem value="school_deactivated">School Deactivated</SelectItem>
              <SelectItem value="user_added">User Added</SelectItem>
              <SelectItem value="settings_updated">Settings Updated</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" /> Filter
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" /> Export Logs
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[160px]">Timestamp</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Supa Admin</TableHead>
                <TableHead>Target School</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {auditLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-mono text-sm">
                    {new Date(log.timestamp).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <span className={severityColors[log.severity]}>
                        {actionIcons[log.action]}
                      </span>
                      <span className="capitalize">
                        {log.action.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{log.supaAdmin}</TableCell>
                  <TableCell>{log.targetSchool}</TableCell>
                  <TableCell>{log.details}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
