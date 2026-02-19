import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function Header({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <header className='sticky top-0 z-30 h-15 w-full bg-background/80 backdrop-blur-md border-b border-border/50 flex items-center justify-center px-2 sm:px-4'>
      <div
        className={cn(
          'w-full max-w-140 mx-auto flex items-center gap-6 sm:gap-10',
          className,
        )}
      >
        {children}
      </div>
    </header>
  );
}
