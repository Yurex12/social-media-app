'use client';

import { useRouter } from 'next/navigation';
import { LogOut, UserPen, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useQueryClient } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { signOut } from '@/lib/auth-client';
import { ModeToggle } from '@/components/ModeToggle';

export default function SettingsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    await signOut({
      fetchOptions: {
        onSuccess() {
          queryClient.clear();
          router.replace('/login');
        },
      },
    });
  };

  return (
    <div className='flex flex-col max-w-140 w-full mx-auto'>
      {/* Header */}

      <div className='flex flex-col'>
        {/* Account Section */}
        <section>
          <h2 className='px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider'>
            Account
          </h2>

          <Link
            href='/settings/username'
            className='flex items-center justify-between px-4 py-4 hover:bg-accent transition-colors border-b'
          >
            <div className='flex items-center gap-3'>
              <div className='p-2 rounded-full bg-primary/10 text-primary'>
                <UserPen className='size-5' />
              </div>
              <div className='flex flex-col'>
                <span className='font-medium'>Change username</span>
                <span className='text-xs text-muted-foreground'>
                  Update your @handle
                </span>
              </div>
            </div>
            <ChevronRight className='size-5 text-muted-foreground' />
          </Link>
        </section>

        {/* Appearance Section */}
        <section className='mt-2'>
          <h2 className='px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider'>
            Appearance
          </h2>
          <div className='flex items-center justify-between px-4 py-3 border-b'>
            <div className='flex flex-col'>
              <span className='font-medium'>Theme</span>
              <span className='text-xs text-muted-foreground'>
                Switch between light and dark mode
              </span>
            </div>
            <ModeToggle />
          </div>
        </section>

        <section className='mt-6 px-4 flex flex-col gap-4'>
          <Button
            variant='ghost'
            onClick={handleLogout}
            className='flex items-center justify-center gap-3 px-4 rounded-sm hover:text-destructive py-2 text-destructive hover:bg-destructive/20 w-30 bg-destructive/10'
          >
            <LogOut className='size-5' />
            <span className='font-semibold'>Logout</span>
          </Button>
        </section>
      </div>
    </div>
  );
}
