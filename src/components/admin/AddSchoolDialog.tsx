import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
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
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

const schoolFormSchema = z.object({
  name: z.string().min(2, 'School name must be at least 2 characters'),
  region: z.string().min(2, 'Region must be at least 2 characters'),
  subscription_plan: z.enum(['basic', 'premium']),
});

type SchoolFormValues = z.infer<typeof schoolFormSchema>;

const defaultValues: Partial<SchoolFormValues> = {
  subscription_plan: 'basic',
};

interface SchoolDialogProps {
  onSchoolAdded?: () => void;
}

export function AddSchoolDialog({ onSchoolAdded }: SchoolDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<SchoolFormValues>({
    resolver: zodResolver(schoolFormSchema),
    defaultValues,
  });

  async function onSubmit(data: SchoolFormValues) {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('schools')
        .insert([data]);

      if (error) throw error;

      form.reset();
      setOpen(false);
      if (onSchoolAdded) onSchoolAdded();
    } catch (error) {
      console.error('Error adding school:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add New School
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New School</DialogTitle>
          <DialogDescription>
            Add a new school to the system. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>School Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter school name" {...field} />
                  </FormControl>
                  <FormDescription>
                    The official name of the school
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="region"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Region</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter region" {...field} />
                  </FormControl>
                  <FormDescription>
                    The geographic region where the school is located
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subscription_plan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subscription Plan</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a plan" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="basic">Basic</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select the subscription plan for this school
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={loading}>
                {loading ? 'Adding...' : 'Add School'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
