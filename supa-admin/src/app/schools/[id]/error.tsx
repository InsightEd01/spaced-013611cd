import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Error | School Management System',
  description: 'An error occurred while loading the school details.',
};

export default function Error() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <AlertTriangle className="h-16 w-16 text-destructive mb-6" />
      <h1 className="text-3xl font-bold tracking-tight mb-2">Something Went Wrong</h1>
      <p className="text-muted-foreground mb-6">
        An error occurred while loading the school details. Please try again later.
      </p>
      <div className="flex gap-4">
        <Button
          variant="outline"
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
        <Button asChild>
          <Link href="/schools">Return to Schools</Link>
        </Button>
      </div>
    </div>
  );
}
