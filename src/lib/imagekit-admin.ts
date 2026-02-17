import ImageKit from '@imagekit/nodejs';

export const imagekitAdmin = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
});
