import { getRequiredSession } from '@/lib/session';
import Post from './Post';

export default async function Posts() {
  const session = await getRequiredSession();

  // session.user.username
  return <Post name={session.user.username!} />;
}
