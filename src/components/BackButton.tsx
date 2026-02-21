'use client';

import { ArrowLeft } from 'lucide-react';

import { useRouter } from 'next/navigation';

export function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className='cursor-pointer'
      type='button'
    >
      <ArrowLeft size={20} />
    </button>
  );
}
