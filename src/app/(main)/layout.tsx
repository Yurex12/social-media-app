import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { WhoToFollow } from '@/components/Suggested';
import { getRequiredSession } from '@/lib/session';
import { ReactNode } from 'react';

export default function MainLayout({
  children,
}: {
  children: Readonly<ReactNode>;
}) {
  getRequiredSession();

  return (
    <div className='grid h-svh md:grid-cols-[250px_1fr] bg-background'>
      <Sidebar />

      <main className='flex flex-col'>
        <Header />

        <section className='grid flex-1 md:grid-cols-[minmax(0,1fr)_320px] gap-6 px-4'>
          {/* Feed scrolls */}
          <div className='overflow-y-auto'>{children}</div>

          {/* Right panel */}
          <aside className='hidden md:block sticky top-[64px] h-fit'>
            <WhoToFollow />
          </aside>
        </section>
      </main>
    </div>
  );
}
