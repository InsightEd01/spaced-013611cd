import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { School } from 'lucide-react';

export const metadata: Metadata = {
  title: '404: School Not Found',
  description: 'The requested school could not be found.',
};

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <School className="h-16 w-16 text-muted-foreground mb-6" />
      <h1 className="text-3xl font-bold tracking-tight mb-2">School Not Found</h1>
      <p className="text-muted-foreground mb-6">
        The school you are looking for does not exist or has been removed.
      </p>
      <Button asChild>
        <Link href="/schools">Return to Schools</Link>
      </Button>
    </div>
  );
}
