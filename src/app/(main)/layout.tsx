import { getRequiredSession } from '@/lib/session';
import { ReactNode } from 'react';

export default function MainLayout({
  children,
}: {
  children: Readonly<ReactNode>;
}) {
  getRequiredSession();

  return (
    <>
      <p>Hello</p>
      {children}
    </>
  );
}
