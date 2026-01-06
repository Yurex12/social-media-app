import Logo from './Logo';
import Navbar from './Navbar';

export function Sidebar() {
  return (
    <aside className='hidden space-y-1 md:block border-r'>
      <Logo className='px-6 py-3 border-b' />

      <Navbar />
    </aside>
  );
}
