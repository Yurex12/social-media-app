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
    <div
      className={cn(
        'sticky top-0 z-30 h-15 w-full bg-background/80 backdrop-blur-md border-b border-border/50 flex items-center gap-10 px-4',
        className,
      )}
    >
      {children}
    </div>
  );
}
