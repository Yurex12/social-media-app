import Logo from './Logo';
import Navbar from './Navbar';

export function Sidebar() {
  return (
    <aside className='hidden md:flex flex-col sticky top-0 h-svh border-r'>
      <Logo className='px-6 py-3' />
      <Navbar />
    </aside>
  );
}
