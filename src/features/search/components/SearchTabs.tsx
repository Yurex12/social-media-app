'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export function SearchTabs() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q') || '';
  const f = searchParams.get('f') || 'posts';

  const tabs = [
    { name: 'Posts', value: 'posts' },
    { name: 'People', value: 'users' },
  ];

  return (
    <div className='flex border-b border-gray-200'>
      {tabs.map((tab) => (
        <Link
          key={tab.value}
          href={`/search?q=${q}&f=${tab.value}`}
          className={`px-4 py-2 font-medium transition-colors ${
            f === tab.value
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {tab.name}
        </Link>
      ))}
    </div>
  );
}
