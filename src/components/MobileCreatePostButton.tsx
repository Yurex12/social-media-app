import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function MobileCreatePostButton() {
  return (
    <Button
      asChild
      size='icon'
      className='fixed bottom-20 right-4 z-50 size-12 rounded-full bg-primary text-white shadow-lg hover:bg-primary/90 sm:hidden'
    >
      <Link href='/post/create'>
        <Plus className='size-6' />
        <span className='sr-only'>Create Post</span>
      </Link>
    </Button>
  );
}
