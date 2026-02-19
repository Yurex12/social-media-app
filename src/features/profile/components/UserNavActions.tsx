import { ModeToggle } from '@/components/ModeToggle';
import { User } from 'lucide-react';

export function UserNavActions() {
  return (
    <div className='flex items-center gap-2'>
      <ModeToggle />

      <div className='ml-1 h-8 w-8 rounded-full bg-muted border border-border overflow-hidden cursor-pointer hover:opacity-80 transition-opacity'>
        <div className='flex h-full w-full items-center justify-center'>
          <User className='h-4 w-4 text-muted-foreground' />
        </div>
      </div>
    </div>
  );
}
