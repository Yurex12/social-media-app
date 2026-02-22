'use client';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const activeRoutes = ['/home', '/profile', '/bookmarks', '/search'];
const hiddenProfileRoutes = ['/followers', '/following'];

export function MobileCreatePostButton() {
  const pathname = usePathname();

  let isVisible = false;

  if (activeRoutes.includes(pathname)) {
    isVisible = true;
  } else if (pathname.startsWith('/profile')) {
    isVisible = !hiddenProfileRoutes.some((r) => pathname.endsWith(r));
  }

  if (!isVisible) return null;

  return (
    <Button
      asChild
      size='icon'
      className='fixed bottom-20 right-4 z-50 size-14 rounded-full bg-primary text-white shadow-lg hover:bg-primary/90 sm:hidden'
    >
      <Link href='/post/create'>
        <Plus className='size-7' />
        <span className='sr-only'>Create Post</span>
      </Link>
    </Button>
  );
}
