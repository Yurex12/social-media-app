interface SuggestedUser {
  id: string;
  name: string;
  username: string;
  avatarUrl?: string;
}

const suggestedUsers: SuggestedUser[] = [
  { id: '1', name: 'Alice Johnson', username: 'alicej' },
  { id: '2', name: 'Bob Smith', username: 'bob_smith' },
  { id: '3', name: 'Charlie Lee', username: 'charlie_lee' },
];

export function WhoToFollow() {
  return (
    <div className='w-full max-w-md h-fit sticky top-24 rounded-lg border border-gray-200 bg-white p-4'>
      <h2 className='mb-3 text-sm font-semibold'>Who to follow</h2>

      <div className='flex flex-col gap-3'>
        {suggestedUsers.map((user) => (
          <div key={user.id} className='flex items-center justify-between'>
            {/* User info */}
            <div className='flex items-center gap-3'>
              <div className='h-10 w-10 rounded-full bg-gray-300 shrink-0' />
              <div className='flex flex-col text-sm'>
                <span className='font-medium'>{user.name}</span>
                <span className='text-gray-500'>@{user.username}</span>
              </div>
            </div>

            {/* Follow button */}
            <button className='rounded-full bg-primary px-3 py-1 text-sm font-medium text-white hover:bg-primary/90 transition'>
              Follow
            </button>
          </div>
        ))}
      </div>

      {/* See more */}
      <button className='mt-3 w-full text-left text-sm font-medium text-primary hover:underline'>
        See more
      </button>
    </div>
  );
}
