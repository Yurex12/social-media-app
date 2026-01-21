import { Search } from 'lucide-react';

export function SearchInput() {
  return (
    <div className='relative flex-1 group'>
      <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors' />
      <input
        type='text'
        placeholder='Search posts or people...'
        className='w-full rounded-full bg-muted/50 px-10 py-2 text-sm outline-none ring-primary/20 transition-all focus:bg-background focus:ring-4 border border-transparent focus:border-primary/50'
      />
    </div>
  );
}
