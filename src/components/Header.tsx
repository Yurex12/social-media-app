'use client';

import { Bell, Search as SearchIcon, Sun, User } from 'lucide-react';
import { BackButton } from './BackButton';

export function Header() {
  return (
    <header className='sticky bg-background top-0 z-10 px-4 py-1 border-b'>
      <div className='max-w-xl mx-auto'>
        <BackButton title='Post' />
      </div>
    </header>
  );
}

// {/* Search input */}
//       <div className='flex-1 max-w-lg relative'>
//         <SearchIcon className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400' />
//         <input
//           type='text'
//           placeholder='Search'
//           className='w-full rounded-lg border border-gray-300 bg-gray-50 px-10 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition'
//         />
//       </div>

//       {/* Right actions */}
//       <div className='ml-4 flex items-center gap-4'>
//         {/* Notification button */}
//         <button className='relative rounded-full p-2 hover:bg-gray-100 transition'>
//           <Sun className='h-5 w-5 text-gray-700' />
//           {/* Example badge */}
//           {/* <span className='absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500'></span> */}
//         </button>

//         {/* User dropdown placeholder */}
//         <div className='flex items-center gap-2 cursor-pointer rounded-lg px-2 py-1 hover:bg-gray-100 transition'>
//           <div className='h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center'>
//             <User className='h-5 w-5 text-gray-500' />
//           </div>
//         </div>
//       </div>
