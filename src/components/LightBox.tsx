'use client';

import { useLightboxStore } from '@/store/useLightboxStore';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

export function LightBox() {
  const { isOpen, slides, photoIndex, closeLightbox } = useLightboxStore();

  return (
    <Lightbox
      open={isOpen}
      close={closeLightbox}
      index={photoIndex}
      slides={slides}
      render={{
        buttonPrev: () => null,
        buttonNext: () => null,
      }}
      carousel={{
        padding: 0,
        preload: 1,
        finite: true,
      }}
      animation={{ fade: 250, swipe: 300 }}
      controller={{
        closeOnBackdropClick: true,
        closeOnPullDown: true,
        preventDefaultWheelY: true,
      }}
    />
  );
}
