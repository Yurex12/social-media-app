import { getRequiredSession } from '@/lib/session';
import { redirect } from 'next/navigation';

export default async function Home() {
  await getRequiredSession();
  redirect('/posts');
}
