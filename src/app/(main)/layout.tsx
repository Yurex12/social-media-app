import { ReactNode } from 'react';

import { getRequiredSession } from '@/lib/session';

import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';

export default async function MainLayout({
  children,
}: {
  children: Readonly<ReactNode>;
}) {
  await getRequiredSession();

  return (
    <div className='grid max-w-6xl w-full mx-auto md:grid-cols-[250px_1fr] h-full'>
      <Sidebar />
      <main className='border-x overflow-y-auto'>{children}</main>
    </div>
  );
}

//  <main className='h-full overflow-y-auto border-x space-y-4 bg-red-500'>
//         {/* <Header /> */}
//         <section className='mx-auto max-w-xl'>{children}</section>
//       </main>

//   <main className=' border-x border-red-500'>
//     {/* <Header /> */}
//     <section className='mx-auto'>{children}</section>
//   </main>
