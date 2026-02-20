import { Spinner } from '@/components/ui/spinner';

export default function Loading() {
  return (
    <div className='flex items-center justify-center h-dvh w-full'>
      <Spinner className='size-6' />
    </div>
  );
}
