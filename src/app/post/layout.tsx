import React, { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <section className='max-w-140 w-full mx-auto sm:border border-border'>
      {children}
    </section>
  );
}
