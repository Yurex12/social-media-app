export function CurrentUsername({ username }: { username: string }) {
  return (
    <div className='flex items-center justify-between rounded-lg border border-blue-100 bg-blue-50/50 px-4 py-3'>
      <span className='text-sm text-gray-600'>Current username:</span>
      <span className='rounded-md bg-white px-3 py-1 text-sm font-semibold text-blue-700 shadow-sm'>
        @{username}
      </span>
    </div>
  );
}
