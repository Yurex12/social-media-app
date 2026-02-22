import { ProfileRelationsHeader } from '@/features/profile/components/ProfileRelationsHeader';
import { ProfileRelationsNav } from '@/features/profile/components/ProfileRelationsNav';
import { ReactNode } from 'react';

export default function ProfileRelationsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div>
      <ProfileRelationsHeader />

      <ProfileRelationsNav />
      <section>{children}</section>
    </div>
  );
}
