'use client';

import { Search, X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlQuery = searchParams.get('q') || '';
  const filter = searchParams.get('f') || 'posts';

  const [query, setQuery] = useState(urlQuery);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const trimmedQuery = query.trim();

    if (!trimmedQuery) return;
    
    router.push(`/search?f=${filter}&q=${encodeURIComponent(trimmedQuery)}`);
  }

  const clearInput = () => setQuery('');

  return (
    <form onSubmit={handleSearch} className='relative flex-1 group w-full'>
      <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors z-10' />

      <Input
        type='text'
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder='Search posts or people...'
        className='pl-10 pr-10 rounded-full bg-muted/50 focus-visible:ring-primary/20 shadow-none w-full'
      />

      {query && (
        <Button
          type='button'
          variant='ghost'
          size='icon'
          onClick={clearInput}
          className='absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full hover:bg-transparent text-muted-foreground hover:text-foreground'
        >
          <X className='h-4 w-4' />
          <span className='sr-only'>Clear search</span>
        </Button>
      )}
    </form>
  );
}
