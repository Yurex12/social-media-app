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
      {images.map((image, i) => (
        <div
          key={image.id}
          className={cn(
            'relative bg-muted overflow-hidden',
            // 1 image = auto height based on width. 2+ images = fixed uniform height.
            imageLength === 1 ? 'w-full h-auto' : 'h-64 sm:h-80',
          )}
          // For 1 image, we use the DB width/height to set the box shape
          style={
            imageLength === 1
              ? { aspectRatio: `${image.width} / ${image.height}` }
              : {}
          }
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
            // Priority for single images to prevent layout shift
            priority={imageLength === 1}
            sizes={imageLength === 1 ? '100vw' : '50vw'}
          />
        </div>
      ))}
    </div>
  );
}
