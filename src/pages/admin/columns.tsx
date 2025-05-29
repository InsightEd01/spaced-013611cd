
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SchoolManagementDialog } from '@/components/admin/SchoolManagementDialog';

interface School {
  id: string;
  name: string;
  region: string;
  subscription_plan: string;
  created_at: string;
}

export const columns: ColumnDef<School>[] = [
  {
    accessorKey: 'name',
    header: 'School Name',
    cell: ({ row }) => {
      return (
        <div className="font-medium">
          {row.getValue('name')}
        </div>
      );
    },
  },
  {
    accessorKey: 'region',
    header: 'Region',
    cell: ({ row }) => {
      return (
        <div className="text-sm text-muted-foreground">
          {row.getValue('region')}
        </div>
      );
    },
  },
  {
    accessorKey: 'subscription_plan',
    header: 'Plan',
    cell: ({ row }) => {
      const plan = row.getValue('subscription_plan') as string;
      return (
        <Badge variant={plan === 'premium' ? 'default' : 'secondary'}>
          {plan.charAt(0).toUpperCase() + plan.slice(1)}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'created_at',
    header: 'Created',
    cell: ({ row }) => {
      const date = new Date(row.getValue('created_at'));
      return (
        <div className="text-sm text-muted-foreground">
          {date.toLocaleDateString()}
        </div>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const school = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(school.id)}
            >
              Copy school ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <SchoolManagementDialog school={school}>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <Edit className="mr-2 h-4 w-4" />
                Edit school
              </DropdownMenuItem>
            </SchoolManagementDialog>
            <DropdownMenuItem className="text-red-600">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete school
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
