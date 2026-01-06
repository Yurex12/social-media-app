import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { getRequiredSession } from '@/lib/session';
import { ReactNode } from 'react';

export default function MainLayout({
  children,
}: {
  children: Readonly<ReactNode>;
}) {
  getRequiredSession();

  return (
    <div className='grid h-svh overflow-hidden bg-background md:grid-cols-[250px_1fr]'>
      <Sidebar />

      <main className='h-full overflow-y-auto'>
        <Header />
        <section>{children}</section>
      </main>
    </div>
  );
}
