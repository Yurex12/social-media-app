import { getRequiredSession } from '@/lib/session';
import React from 'react';

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  getRequiredSession();
  return (
    <div className='flex h-screen flex-col items-center justify-center p-6 md:p-10 '>
      {children}
    </div>
  );
}
