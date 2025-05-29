
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Plus, Edit } from 'lucide-react';

interface SchoolFormData {
  name: string;
  region: string;
  subscription_plan: 'basic' | 'premium';
  description?: string;
}

interface SchoolManagementDialogProps {
  school?: {
    id: string;
    name: string;
    region: string;
    subscription_plan: string;
  };
  onSuccess?: () => void;
  children?: React.ReactNode;
}

export const SchoolManagementDialog = ({ school, onSuccess, children }: SchoolManagementDialogProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<SchoolFormData>({
    name: school?.name || '',
    region: school?.region || '',
    subscription_plan: (school?.subscription_plan as 'basic' | 'premium') || 'basic',
    description: '',
  });

  const isEditing = !!school;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEditing) {
        const { error } = await supabase
          .from('schools')
          .update({
            name: formData.name,
            region: formData.region,
            subscription_plan: formData.subscription_plan,
          })
          .eq('id', school.id);

        if (error) throw error;
        toast.success('School updated successfully');
      } else {
        const { error } = await supabase
          .from('schools')
          .insert({
            name: formData.name,
            region: formData.region,
            subscription_plan: formData.subscription_plan,
          });

        if (error) throw error;
        toast.success('School created successfully');
      }

      setOpen(false);
      setFormData({
        name: '',
        region: '',
        subscription_plan: 'basic',
        description: '',
      });
      onSuccess?.();
    } catch (error) {
      console.error('Error saving school:', error);
      toast.error('Failed to save school');
    } finally {
      setLoading(false);
    }
  };

  const regions = [
    'North Region',
    'South Region',
    'East Region',
    'West Region',
    'Central Region',
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button>
            {isEditing ? <Edit className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
            {isEditing ? 'Edit School' : 'Add New School'}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit School' : 'Add New School'}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Update the school information below.' 
              : 'Fill in the details to create a new school.'
            }
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">School Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter school name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="region">Region</Label>
            <Select
              value={formData.region}
              onValueChange={(value) => setFormData({ ...formData, region: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a region" />
              </SelectTrigger>
              <SelectContent>
                {regions.map((region) => (
                  <SelectItem key={region} value={region}>
                    {region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subscription_plan">Subscription Plan</Label>
            <Select
              value={formData.subscription_plan}
              onValueChange={(value: 'basic' | 'premium') => setFormData({ ...formData, subscription_plan: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="basic">Basic Plan</SelectItem>
                <SelectItem value="premium">Premium Plan</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {!isEditing && (
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter school description"
                rows={3}
              />
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : (isEditing ? 'Update School' : 'Create School')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
