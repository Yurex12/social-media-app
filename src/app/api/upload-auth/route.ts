// File: app/api/upload-auth/route.ts
import { getSession } from '@/lib/session';
import { getUploadAuthParams } from '@imagekit/next/server';

export async function GET() {
  const session = await getSession();

  if (!session) {
    Response.json(
      { message: 'Session expired. Please log in again.' },
      { status: 401 }
    );
  }

  const { token, expire, signature } = getUploadAuthParams({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string,
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY as string,
  });

  return Response.json({
    token,
    expire,
    signature,
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  });
}
