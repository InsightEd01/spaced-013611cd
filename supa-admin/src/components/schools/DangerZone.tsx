import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Loader2 } from 'lucide-react';

interface DangerZoneProps {
  schoolId: string;
}

export default function DangerZone({ schoolId }: DangerZoneProps) {
  const router = useRouter();
  const [isDeactivating, setIsDeactivating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeactivateDialog, setShowDeactivateDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  async function handleDeactivate() {
    try {
      setIsDeactivating(true);
      const response = await fetch(`/api/schools/${schoolId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'inactive' }),
      });

      if (!response.ok) throw new Error('Failed to deactivate school');

      setShowDeactivateDialog(false);
      router.refresh();
    } catch (error) {
      console.error('Error deactivating school:', error);
    } finally {
      setIsDeactivating(false);
    }
  }

  async function handleDelete() {
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/schools/${schoolId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete school');

      router.push('/schools');
    } catch (error) {
      console.error('Error deleting school:', error);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between space-x-4">
          <div>
            <h4 className="font-semibold text-destructive">Deactivate School</h4>
            <p className="text-sm text-muted-foreground">
              Temporarily disable all functionality for this school. Can be reactivated later.
            </p>
          </div>
          <Button
            variant="destructive"
            onClick={() => setShowDeactivateDialog(true)}
            disabled={isDeactivating}
          >
            {isDeactivating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Deactivate
          </Button>
        </div>

        <div className="flex items-center justify-between space-x-4">
          <div>
            <h4 className="font-semibold text-destructive">Delete School</h4>
            <p className="text-sm text-muted-foreground">
              Permanently delete this school and all its data. This action cannot be undone.
            </p>
          </div>
          <Button
            variant="destructive"
            onClick={() => setShowDeleteDialog(true)}
            disabled={isDeleting}
          >
            {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete
          </Button>
        </div>
      </div>

      <AlertDialog open={showDeactivateDialog} onOpenChange={setShowDeactivateDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to deactivate this school?</AlertDialogTitle>
            <AlertDialogDescription>
              This will temporarily disable all functionality for this school. Users will not be able
              to access any features until the school is reactivated.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeactivate}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeactivating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Deactivate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this school?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. All data associated with this school will be permanently
              deleted, including student records, teacher accounts, and academic data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex items-center space-x-2 py-4">
            <Switch
              id="confirm-delete"
              checked={confirmDelete}
              onCheckedChange={setConfirmDelete}
            />
            <Label htmlFor="confirm-delete">
              Yes, I want to permanently delete this school and all its data
            </Label>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={!confirmDelete || isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete School
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
