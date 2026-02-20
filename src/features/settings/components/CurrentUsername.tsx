export function CurrentUsername({ username }: { username: string }) {
  return (
    <div className='flex items-center justify-between rounded-lg border bg-muted/30 px-4 py-3 transition-colors'>
      <span className='text-sm text-muted-foreground'>Current username:</span>
      <span className='rounded-md border bg-background px-3 py-1 text-sm font-semibold text-primary shadow-sm'>
        @{username}
      </span>
    </div>
  );
}
