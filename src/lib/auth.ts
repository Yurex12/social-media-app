import { APIError, betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import prisma from './prisma';

import { nextCookies } from 'better-auth/next-js';
import { generateUsername } from './username';
import { username } from 'better-auth/plugins';

const MAX_TRIES = 30;

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          for (let i = 0; i < MAX_TRIES; i++) {
            const candidate = generateUsername(user.name, i);

            const usernameExist = await prisma.user.findUnique({
              where: { username: candidate },
              select: { id: true },
            });

            if (!usernameExist) {
              return {
                data: {
                  ...user,
                  username: candidate.toLowerCase(),
                  displayUsername: candidate,
                },
              };
            }
          }

          throw new APIError('BAD_REQUEST', {
            message:
              'We couldn’t create a username at the moment. Please try again later.',
          });
        },
      },
    },
  },
  user: {
    additionalFields: {
      username: {
        type: 'string',
        required: false,
        input: false,
        unique: true,
      },
      bio: {
        type: 'string',
        required: false,
        input: false,
      },
      coverImage: {
        type: 'string',
        required: false,
        input: false,
      },
      imageFileId: { type: 'string', required: false, input: false },
      coverImageFileId: { type: 'string', required: false, input: false },
    },
  },

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 25,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  // session: {
  //   cookieCache: {
  //     enabled: true,
  //     maxAge: 5 * 60,
  //   },
  // },
  plugins: [username(), nextCookies()],
});

export type User = typeof auth.$Infer.Session.user;
export type Session = typeof auth.$Infer.Session;
