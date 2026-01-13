import { Prisma } from '@/generated/prisma/client';

export type CreatePostResponse = { id: string };

export type GetPostsResponse = { content: string; id: string }[];

export type PostWithRelations = Prisma.PostGetPayload<{
  include: {
    images: { select: { id: true; url: true; fileId: true } };
    user: {
      select: {
        name: true;
        username: true;
        image: true;
      };
    };
  };
}>;

export type PostHeaderProps = {
  user: { image: string | null; name: string; username: string };
};
