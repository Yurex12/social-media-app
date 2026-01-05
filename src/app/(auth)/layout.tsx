import { getRequiredSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

export default function AuthLayout({
  children,
}: {
  children: Readonly<ReactNode>;
}) {
  //   getRequiredSession();
  //   redirect('/');
  return <>{children}</>;
}
