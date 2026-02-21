'use client';

import { cn } from '@/lib/utils';
import { useLightboxStore } from '@/store/useLightboxStore';
import Image from 'next/image';

type MediaGalleryProps = {
  images: { id: string; url: string; width: number; height: number }[];
};

export function MediaGallery({ images }: MediaGalleryProps) {
  const openLightbox = useLightboxStore((state) => state.openLightbox);
  const imageLength = images.length;

  if (!imageLength) return null;

  return (
    <div
      className={cn(
        'mx-auto mt-2 grid w-full gap-0.5 overflow-hidden rounded-xl border',
        imageLength === 1 ? 'grid-cols-1' : 'grid-cols-2',
      )}
    >
      {images.map((image, i) => {
        if (imageLength === 1) {
          return (
            <div key={image.id} className='bg-muted overflow-hidden'>
              <Image
                src={image.url}
                alt={`Post image ${i + 1}`}
                width={image.width}
                height={image.height}
                className='w-full h-auto object-cover cursor-pointer hover:opacity-95 transition-opacity'
                priority
                sizes='100vw'
                onClick={(e) => {
                  e.stopPropagation();
                  openLightbox(i, images);
                }}
              />
            </div>
          );
        }

        return (
          <div
            key={image.id}
            className='relative h-64 sm:h-80 bg-muted overflow-hidden'
          >
            <Image
              src={image.url}
              alt={`Post image ${i + 1}`}
              fill
              className='object-cover cursor-pointer hover:opacity-95 transition-opacity'
              sizes='50vw'
              onClick={(e) => {
                e.stopPropagation();
                openLightbox(i, images);
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
