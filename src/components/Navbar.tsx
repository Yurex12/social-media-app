'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import { links } from '@/constants';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className='flex flex-col gap-3 p-3'>
      {links.map(({ href, label, Icon }) => {
        const isActive = pathname === href;

        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 rounded-full px-4 w-fit py-2 text-sm font-medium transition-colors',
              'hover:bg-primary/10 hover:text-primary',
              isActive && 'bg-primary/15 text-primary'
            )}
          >
            <Icon className='h-5 w-5' />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
