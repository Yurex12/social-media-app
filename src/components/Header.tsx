import { ReactNode } from 'react';

export function Header({ children }: { children: ReactNode }) {
  return (
    <div className='sticky top-0 z-30 w-full bg-background/80 backdrop-blur-md border-b border-border/50 flex items-center gap-4 px-4 py-2.5'>
      {children}
    </div>
  );
}
