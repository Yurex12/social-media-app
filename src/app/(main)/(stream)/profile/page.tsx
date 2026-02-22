import { getRequiredSession } from '@/lib/session';
import { redirect } from 'next/navigation';

export default async function Page() {
  const { user } = await getRequiredSession();
  if (user) redirect(`/profile/${user.username}`);
}
