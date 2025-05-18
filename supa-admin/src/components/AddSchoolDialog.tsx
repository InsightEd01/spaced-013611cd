import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
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

const subscriptionPlans = [
  { id: 'basic', name: 'Basic Plan' },
  { id: 'premium', name: 'Premium Plan' },
  { id: 'enterprise', name: 'Enterprise Plan' },
];

const regions = [
  'North America',
  'South America',
  'Europe',
  'Asia',
  'Africa',
  'Oceania',
];

const formSchema = z.object({
  name: z.string().min(3, { message: 'School name must be at least 3 characters' }),
  region: z.string().min(1, { message: 'Please select a region' }),
  subscriptionPlan: z.string().min(1, { message: 'Please select a subscription plan' }),
  adminEmail: z.string().email({ message: 'Please enter a valid email address' }),
});

export function AddSchoolDialog() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      region: '',
      subscriptionPlan: '',
      adminEmail: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Here you would call your API to create the school
      console.log(values);
      
      // Show success message and reset form
      form.reset();
    } catch (error) {
      console.error('Failed to create school:', error);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" /> Add School
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New School</DialogTitle>
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a region" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {regions.map((region) => (
                        <SelectItem key={region} value={region}>
                          {region}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subscriptionPlan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subscription Plan</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a subscription plan" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {subscriptionPlans.map((plan) => (
                        <SelectItem key={plan.id} value={plan.id}>
                          {plan.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="adminEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>School Admin Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="admin@school.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end pt-4">
              <Button type="submit">Create School</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
