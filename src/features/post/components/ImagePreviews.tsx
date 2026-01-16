import { useEffect, useMemo } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import { MAX_FILE_SIZE } from '@/constants';

// Define what an existing image looks like
type ExistingImage = { fileId: string; url: string };
type PreviewImage = File | ExistingImage;

export function ImagePreviews({
  images,
  disabled,
  removeImage,
}: {
  images: PreviewImage[];
  disabled: boolean;
  removeImage: (index: number) => void;
}) {
  const previews = useMemo(() => {
    return images.map((img) => {
      const isFile = img instanceof File;

      return {
        src: isFile ? URL.createObjectURL(img) : img.url,
        name: isFile ? img.name : 'Post image',
        isLarge: isFile ? img.size > MAX_FILE_SIZE : false,
        isFile,
      };
    });
  }, [images]);

  useEffect(() => {
    return () => {
      previews.forEach((p) => {
        if (p.isFile) URL.revokeObjectURL(p.src);
      });
    };
  }, [previews]);

  if (images.length === 0) return null;

  return (
    <div
      className={`mx-auto mt-1 grid w-full gap-2 ${
        previews.length > 1 ? 'grid-cols-2' : 'grid-cols-1'
      }`}
    >
      {previews.map(({ src, name, isLarge }, index) => (
        <div
          key={index}
          className='relative h-60 overflow-hidden rounded-lg border bg-muted'
        >
          <Image
            src={src}
            alt={name}
            fill
            className={`object-cover transition-opacity h-full ${
              isLarge ? 'opacity-40 grayscale' : 'opacity-100'
            }`}
          />

          {isLarge && (
            <div className='absolute inset-0 flex items-center justify-center p-2'>
              <p className='rounded bg-red-600 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-xl'>
                Too Large (Max 5MB)
              </p>
            </div>
          )}

          <button
            onClick={() => removeImage(index)}
            className='absolute top-2 right-2 rounded-full bg-black/50 p-1.5 text-white backdrop-blur-sm transition-colors disabled:cursor-not-allowed hover:bg-black/80'
            type='button'
            disabled={disabled}
          >
            <X className='size-4' />
          </button>
        </div>
      ))}
    </div>
  );
}
