import { ReactNode } from 'react';

import { getRequiredSession } from '@/lib/session';

import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';

export default function MainLayout({
  children,
}: {
  children: Readonly<ReactNode>;
}) {
  getRequiredSession();

  return (
    <div className='grid h-svh overflow-hidden md:grid-cols-[250px_1fr]'>
      <Sidebar />

      <main className='h-full overflow-y-auto border-x space-y-4'>
        <Header />
        <section className='mx-auto max-w-xl '>{children}</section>
      </main>
    </div>
  );
}
