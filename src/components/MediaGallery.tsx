'use client';

import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

type MediaGalleryProps = {
  images: { id: string; url: string }[];
};

export function MediaGallery({ images }: MediaGalleryProps) {
  const [open, setOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  const imageLength = images.length;

  if (!imageLength) return null;

  const handleOpen = (index: number) => {
    setPhotoIndex(index);
    setOpen(true);
  };
  return (
    <>
      <div
        className={cn(
          'mx-auto mt-2 grid w-full gap-0.5 overflow-hidden rounded-lg',
          imageLength === 1 ? 'grid-cols-1' : 'grid-cols-2'
        )}
      >
        {images.map((image, i) => (
          <div
            key={image.id}
            className={cn(
              'relative bg-muted',
              imageLength === 1 ? 'aspect-video' : 'h-64 sm:h-80'
            )}
          >
            <Image
              src={image.url}
              alt={`Post image ${i + 1}`}
              fill
              className='object-cover cursor-pointer hover:opacity-95 transition-opacity'
              onClick={(e) => {
                e.stopPropagation();
                handleOpen(i);
              }}
              sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
            />
          </div>
        ))}
      </div>

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={images.map((image) => ({ ...image, src: image.url }))}
        index={photoIndex}
        controller={{ closeOnBackdropClick: true, closeOnPullDown: true }}
        styles={{
          container: {
            backgroundColor: 'rgba(0, 0, 0, 0.98)',
          },
        }}
      />
    </>
  );
}

// <div
//         className={`mx-auto mt-2 grid w-full grid-cols-1 ${
//           imageLength > 1 ? 'grid-cols-2 gap-x-0.5' : ''
//         }`}
//       >
//         <div className={`relative ${images.length > 1 ? 'h-80' : 'h-auto'}`}>
//           {images.map((image, i) => (
//             <Image
//               src={image.url}
//               alt='image'
//               fill
//               className='w-full rounded-sm object-cover'
//               key={image.id}
//               onClick={(e) => {
//                 e.stopPropagation();
//                 handleOpen(i);
//               }}
//             />
//           ))}
//         </div>
//         {images.map((image, i) => (
//           <img
//             src={image.url}
//             alt='image'
//             className={`w-full rounded-sm object-cover ${
//               images.length > 1 ? 'h-80' : 'h-auto'
//             }`}
//             key={image.id}
//             onClick={(e) => {
//               e.stopPropagation();
//               handleOpen(i);
//             }}
//           />
//         ))}
//       </div>
