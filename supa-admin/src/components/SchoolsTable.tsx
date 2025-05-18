import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Edit, Trash } from 'lucide-react';
import Link from 'next/link';

const mockSchools = [
  {
    id: '1',
    name: 'International School of Excellence',
    region: 'North America',
    subscriptionStatus: 'Active',
    totalStudents: 850,
  },
  {
    id: '2',
    name: 'British Academy',
    region: 'Europe',
    subscriptionStatus: 'Active',
    totalStudents: 620,
  },
  {
    id: '3',
    name: 'Global Learning Center',
    region: 'Asia',
    subscriptionStatus: 'Trial',
    totalStudents: 450,
  },
];

export function SchoolsTable() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Region</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Students</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockSchools.map((school) => (
            <TableRow key={school.id}>
              <TableCell>{school.name}</TableCell>
              <TableCell>{school.region}</TableCell>
              <TableCell>
                <div className={\`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                  \${
                    school.subscriptionStatus === 'Active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }\`}
                >
                  {school.subscriptionStatus}
                </div>
              </TableCell>
              <TableCell>{school.totalStudents}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={\`/schools/\${school.id}\`} className="flex items-center">
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
