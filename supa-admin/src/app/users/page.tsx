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
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Eye,
  Lock,
  MoreHorizontal,
  Plus,
  Search,
  Shield,
  Trash,
  UserPlus,
} from 'lucide-react';
import { AddAdminDialog } from '@/components/AddAdminDialog';

// Mock data for demonstration
const supaAdmins = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@admin.com',
    lastLogin: '2025-05-18T10:30:00Z',
    status: 'Active',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@admin.com',
    lastLogin: '2025-05-17T15:45:00Z',
    status: 'Active',
  },
];

const schoolAdmins = [
  {
    id: '1',
    name: 'Michael Brown',
    email: 'michael@school.com',
    school: 'International School of Excellence',
    lastLogin: '2025-05-18T09:15:00Z',
    status: 'Active',
  },
  {
    id: '2',
    name: 'Sarah Wilson',
    email: 'sarah@school.com',
    school: 'British Academy',
    lastLogin: '2025-05-17T16:20:00Z',
    status: 'Pending',
  },
];

export default function UserManagementPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">User Management</h1>
        <div className="flex gap-3">
          <AddAdminDialog type="supa" />
          <AddAdminDialog type="school" />
        </div>
      </div>

      <Tabs defaultValue="supa-admins" className="space-y-6">
        <TabsList>
          <TabsTrigger value="supa-admins">Supa Admins</TabsTrigger>
          <TabsTrigger value="school-admins">School Admins</TabsTrigger>
        </TabsList>

        <TabsContent value="supa-admins">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Supa Administrators</CardTitle>
              <div className="flex w-full max-w-sm items-center space-x-2">
                <Input
                  placeholder="Search supa admins..."
                  className="w-[300px]"
                />
                <Button variant="outline" size="icon">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {supaAdmins.map((admin) => (
                    <TableRow key={admin.id}>
                      <TableCell className="font-medium">{admin.name}</TableCell>
                      <TableCell>{admin.email}</TableCell>
                      <TableCell>
                        {new Date(admin.lastLogin).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Shield className="h-4 w-4 text-green-500 mr-2" />
                          {admin.status}
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Lock className="mr-2 h-4 w-4" />
                              Reset Password
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash className="mr-2 h-4 w-4" />
                              Remove Access
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="school-admins">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>School Administrators</CardTitle>
              <div className="flex w-full max-w-sm items-center space-x-2">
                <Input
                  placeholder="Search school admins..."
                  className="w-[300px]"
                />
                <Button variant="outline" size="icon">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>School</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {schoolAdmins.map((admin) => (
                    <TableRow key={admin.id}>
                      <TableCell className="font-medium">{admin.name}</TableCell>
                      <TableCell>{admin.email}</TableCell>
                      <TableCell>{admin.school}</TableCell>
                      <TableCell>
                        {new Date(admin.lastLogin).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {admin.status === 'Active' ? (
                            <Shield className="h-4 w-4 text-green-500 mr-2" />
                          ) : (
                            <UserPlus className="h-4 w-4 text-yellow-500 mr-2" />
                          )}
                          {admin.status}
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Lock className="mr-2 h-4 w-4" />
                              Reset Password
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash className="mr-2 h-4 w-4" />
                              Remove Access
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
