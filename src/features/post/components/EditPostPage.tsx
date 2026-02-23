'use client';

import { useParams } from 'next/navigation';
import { usePostDetails } from '../hooks/usePostDetails';
import { EditPostFormMobile } from './EditPostFormMobile';
import { Spinner } from '@/components/ui/spinner';
import { Header } from '@/components/Header';
import { BackButton } from '@/components/BackButton';

export function EditPostPage() {
  const { id } = useParams() as { id: string };
  const { post, isPending, error } = usePostDetails(id);

  if (isPending)
    return (
      <div className='flex h-dvh items-center justify-center'>
        <Spinner className='size-6' />
      </div>
    );

  if (error)
    return (
      <div>
        <Header>
          <BackButton />
        </Header>
        <div className='p-4 text-center'>{error.message}</div>;
      </div>
    );

  if (!post)
    return (
      <div>
        <Header>
          <BackButton />
        </Header>
        <div className='p-4 text-center'>Post not found</div>;
      </div>
    );

  return <EditPostFormMobile post={post} />;
}
