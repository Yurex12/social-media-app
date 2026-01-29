// components/post/media-gallery.tsx
'use client';

import { cn } from '@/lib/utils';
import { useLightboxStore } from '@/store/useLightboxStore';
import Image from 'next/image';

type MediaGalleryProps = {
  images: { id: string; url: string }[];
};

export function MediaGallery({ images }: MediaGalleryProps) {
  const openLightbox = useLightboxStore((state) => state.openLightbox);
  const imageLength = images.length;

  if (!imageLength) return null;

  return (
    <div
      className={cn(
        'mx-auto mt-2 grid w-full gap-0.5 overflow-hidden rounded-lg',
        imageLength === 1 ? 'grid-cols-1' : 'grid-cols-2',
      )}
    >
      {images.map((image, i) => (
        <div
          key={image.id}
          className={cn(
            'relative bg-muted',
            imageLength === 1 ? 'aspect-video' : 'h-64 sm:h-80',
          )}
        >
          <Image
            src={image.url}
            alt={`Post image ${i + 1}`}
            fill
            className='object-cover cursor-pointer hover:opacity-95 transition-opacity'
            onClick={(e) => {
              e.stopPropagation();
              openLightbox(i, images);
            }}
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
          />
        </div>
      ))}
    </div>
  );
}
