'use client';

import { useLightboxStore } from '@/store/useLightboxStore';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

export function GlobalLightBox() {
  const { isOpen, slides, photoIndex, closeLightbox } = useLightboxStore();

  return (
    <Lightbox
      open={isOpen}
      close={closeLightbox}
      index={photoIndex}
      slides={slides}
      controller={{ closeOnBackdropClick: true, closeOnPullDown: true }}
      styles={{
        container: { backgroundColor: 'rgba(0, 0, 0, 0.98)' },
      }}
    />
  );
}
