import { ColumnDef } from '@tanstack/react-table';
import { School } from '@/types/database';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Edit, Trash } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const columns: ColumnDef<School>[] = [
  {
    accessorKey: 'name',
    header: 'School Name',
  },
  {
    accessorKey: 'region',
    header: 'Region',
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
      return new Date(row.getValue('created_at')).toLocaleDateString();
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
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Edit className="mr-2 h-4 w-4" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">
              <Trash className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
