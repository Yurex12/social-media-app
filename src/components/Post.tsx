import React from 'react';
import { MoreVertical, Heart, MessageSquare, Bookmark } from 'lucide-react';

function PostCard() {
  // --- HARD-CODED POST DATA ---
  const postText =
    'Just finished prototyping the new feed layout! Focus was on accessibility and minimizing cognitive load. What are your favorite design principles right now? #UIUX #DesignThinking';
  const postImages = ['/image.png', '/image.png'];

  const postLikes = 125;
  const postComments = 42;
  const postTimestamp = '2 hours ago';

  return (
    <div className='bg-white dark:bg-gray-900 shadow-3xl rounded-3xl w-full max-w-xl mx-auto my-6 overflow-hidden border border-gray-100 dark:border-gray-800'>
      {/* HEADER */}
      <div className='px-5 sm:px-6 pt-5 pb-4'>
        <div className='flex items-center justify-between mb-4'>
          <div className='flex items-center space-x-3'>
            <img
              className='w-10 h-10 object-cover rounded-full ring-2 ring-indigo-500/50 dark:ring-indigo-400/50'
              src='https://placehold.co/100x100/4F46E5/FFFFFF?text=AR'
              alt='Alex Rivera avatar'
            />
            <div className='flex flex-col'>
              <h2 className='text-base font-semibold text-gray-900 dark:text-white leading-snug'>
                Alex Rivera
              </h2>
              <p className='text-xs text-indigo-600 dark:text-indigo-400 font-medium'>
                @alex.codes
              </p>
            </div>
          </div>
          <MoreVertical className='w-5 h-5 text-gray-400 dark:text-gray-300' />
        </div>

        {/* POST TEXT */}
        <div className='mb-4'>
          <p className='text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed'>
            {postText}
          </p>
        </div>
      </div>

      {/* MEDIA BELOW TEXT */}
      {postImages.length > 0 && (
        <div className='grid grid-cols-2 gap-0.5 max-h-[400px]'>
          {postImages.map((url, index) => (
            <img
              key={index}
              src={url}
              alt={`Post media ${index + 1}`}
              className={`w-full h-full object-cover ${
                index === 0 ? 'rounded-bl-3xl' : 'rounded-br-3xl'
              }`}
            />
          ))}
        </div>
      )}

      {/* ENGAGEMENT STRIP */}
      <div className='px-5 sm:px-6 pt-2 pb-4 flex justify-between items-center border-t border-gray-100 dark:border-gray-800/70'>
        <div className='flex space-x-4'>
          <div className='flex items-center space-x-1.5 text-gray-500'>
            <Heart className='w-5 h-5' fill='none' strokeWidth={1.75} />
            <span className='text-sm font-medium'>
              {postLikes.toLocaleString()}
            </span>
          </div>
          <div className='flex items-center space-x-1.5 text-gray-500'>
            <MessageSquare className='w-5 h-5' fill='none' strokeWidth={1.75} />
            <span className='text-sm font-medium'>
              {postComments.toLocaleString()}
            </span>
          </div>
        </div>

        <div className='flex items-center space-x-3'>
          <Bookmark
            className='w-5 h-5 text-gray-500'
            fill='none'
            strokeWidth={1.75}
          />
          <span className='text-xs text-gray-400 dark:text-gray-500 ml-4'>
            {postTimestamp}
          </span>
        </div>
      </div>
    </div>
  );
}

export default PostCard;
