import { getRequiredSession } from '@/lib/session';
import React, { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
  getRequiredSession();
  return (
    <section className='max-w-140 w-full mx-auto sm:border border-border'>
      {children}
    </section>
  );
}
