import { getRequiredSession } from '@/lib/session';
import { Logo } from './Logo';
import Navbar from './Navbar';

export async function Sidebar() {
  const { user } = await getRequiredSession();
  return (
    <aside className='sticky top-0 hidden h-fit space-y-1 md:block'>
      <Logo className='px-6 py-3 ' />
      <Navbar username={user.username!} />
    </aside>
  );
}
