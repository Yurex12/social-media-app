'use client';
import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';

export function TextExpander({
  content,
  wordLimit = 40,
  className,
}: {
  content: string;
  wordLimit?: number;
  className?: string;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const { words, isLong } = useMemo(() => {
    const allWords = content.trim().split(/\s+/);
    return {
      words: allWords,
      isLong: allWords.length > wordLimit,
    };
  }, [content, wordLimit]);

  if (!content?.trim()) return null;

  return (
    <div
      className={cn(
        'px-2 sm:px-4 leading-relaxed text-foreground/75',
        className,
      )}
    >
      <p className='whitespace-pre-wrap wrap-break-word inline'>
        {isExpanded ? (
          content
        ) : (
          <>
            {words
              .slice(0, wordLimit)
              .join(' ')
              .replace(/[.,!?;:]+$/, '')}
            {isLong && <span className='text-muted-foreground'>...</span>}
          </>
        )}
      </p>

      {isLong && !isExpanded && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(true);
          }}
          className='ml-1 text-sm font-medium text-primary hover:underline inline-block cursor-pointer'
        >
          Show more
        </button>
      )}
    </div>
  );
}
