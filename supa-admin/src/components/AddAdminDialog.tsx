import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { createAdmin } from '@/lib/admin-management';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus } from 'lucide-react';

interface AddAdminDialogProps {
  type: 'supa' | 'school';
}

const formSchema = z.object({
  name: z.string().min(3, { message: 'Name must be at least 3 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  school: z.string().optional(),
});

const mockSchools = [
  { id: '1', name: 'International School of Excellence' },
  { id: '2', name: 'British Academy' },
  { id: '3', name: 'Global Learning Center' },
];

export function AddAdminDialog({ type }: AddAdminDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      school: '',
    },
  });

  const title = type === 'supa' ? 'Add Supa Admin' : 'Add School Admin';
  const buttonLabel = type === 'supa' ? 'Add Supa Admin' : 'Add School Admin';

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const { success, error } = await createAdmin(type, {
        email: values.email,
        name: values.name,
        schoolId: type === 'school' ? values.school : undefined,
      });

      if (!success) throw error;
      
      // Show success message and reset form
      toast({
        title: "Admin Created",
        description: "A welcome email has been sent with login instructions.",
      });
      form.reset();
    } catch (error) {
      console.error('Failed to create admin:', error);
      toast({
        title: "Error",
        description: "Failed to create admin user. Please try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" /> {buttonLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter admin name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="admin@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {type === 'school' && (
              <FormField
                control={form.control}
                name="school"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>School</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a school" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {mockSchools.map((school) => (
                          <SelectItem key={school.id} value={school.id}>
                            {school.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="flex justify-end pt-4">
              <Button type="submit">Create Admin</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
