import { create } from 'zustand';

type LightboxStore = {
  isOpen: boolean;
  photoIndex: number;
  slides: { src: string }[];
  openLightbox: (index: number, images: { url: string }[]) => void;
  closeLightbox: () => void;
};

export const useLightboxStore = create<LightboxStore>((set) => ({
  isOpen: false,
  photoIndex: 0,
  slides: [],
  openLightbox: (index, images) =>
    set({
      isOpen: true,
      photoIndex: index,
      slides: images.map((img) => ({ src: img.url })),
    }),
  closeLightbox: () => set({ isOpen: false }),
}));
