import { ReactNode } from 'react';

import { getRequiredSession } from '@/lib/session';

import { Sidebar } from '@/components/Sidebar';

export default async function MainLayout({
  children,
}: {
  children: Readonly<ReactNode>;
}) {
  await getRequiredSession();

  return (
    <div className='grid max-w-7xl w-full mx-auto md:grid-cols-[280px_1fr]'>
      <Sidebar />
      <main className='border-l h-full'>{children}</main>
    </div>
  );
}
