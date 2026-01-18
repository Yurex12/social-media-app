'use client';

import { ArrowLeft } from 'lucide-react';

import { useRouter } from 'next/navigation';

export function BackButton({ title }: { title?: string }) {
  const router = useRouter();

  return (
    <div className='flex gap-10 py-2'>
      <button onClick={() => router.back()} className='cursor-pointer'>
        <ArrowLeft size={20} />
      </button>

      <h2 className='text-foreground text-xl font-semibold'>
        {title || 'Back'}
      </h2>
    </div>
  );
}
