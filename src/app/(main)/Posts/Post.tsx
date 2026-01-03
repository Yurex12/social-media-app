'use client';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { signOut } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import toast from 'react-hot-toast';

export default function Post({ name }: { name: string }) {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  function handleLogout() {
    startTransition(async () => {
      await signOut({
        fetchOptions: {
          onSuccess() {
            toast.success('Logout successful');
            router.replace('/login');
          },
          onError(ctx) {
            toast.error(ctx.error.message || 'Something went wrong');
          },
        },
      });
    });
  }

  return (
    <div>
      <p>Welcome, {name}</p>

      <Button onClick={handleLogout} disabled={isPending} className='w-25'>
        {isPending ? <Spinner /> : <span>Logout</span>}
      </Button>
    </div>
  );
}
