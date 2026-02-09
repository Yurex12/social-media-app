import Logo from './Logo';
import Navbar from './Navbar';

export function Sidebar() {
  
  return (
    <aside className='sticky top-0 hidden h-fit space-y-1 md:block'>
      <Logo className='px-6 py-3 ' />
      <Navbar />
    </aside>
  );
}
