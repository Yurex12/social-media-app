import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { CreatePost } from '@/features/post/components/CreatePost';
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

      <main className='h-full overflow-y-auto border-x'>
        <Header />
        <section>
          <CreatePost />
          {children}
        </section>
      </main>

      {/* <WhoToFollow /> */}
    </div>
  );
}
