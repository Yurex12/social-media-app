export function SuggestedUsernames({
  suggestions,
  onSelectUsername,
}: {
  suggestions: string[];
  onSelectUsername: (value: string) => void;
}) {
  if (suggestions.length === 0) return null;

  return (
    <div className='flex flex-wrap items-center gap-2'>
      <span className='text-sm font-medium'>Suggestions:</span>
      <div className='flex flex-wrap gap-1'>
        {suggestions.map((suggestion, index) => (
          <button
            key={`${suggestion}-${index}`}
            type='button'
            onClick={() => onSelectUsername(suggestion)}
            className='text-sm cursor-pointer text-primary hover:underline font-medium'
          >
            {suggestion}
            {index < suggestions.length - 1 ? ',' : ''}
          </button>
        ))}
      </div>
    </div>
  );
}
