import Prisma from '@/database/database';
import { PrismaAdapter } from '@auth/prisma-adapter';
import NextAuth from 'next-auth';
import { Adapter } from 'next-auth/adapters';
import GoogleProvider from 'next-auth/providers/google';

const handler = NextAuth({
	adapter: PrismaAdapter(Prisma) as Adapter,
	providers: [
		GoogleProvider({
			clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET as string,
		}),
	],
	callbacks: {
		async session({ session }) {
			if (session.user) {
				const user = await Prisma.user.findUnique({
					where: {
						// @ts-ignore
						email: session.user.email,
					},
				});

				// @ts-ignore
				session.user = user;
			}

			return session;
		},
		async signIn({ profile }) {
			if (profile) {
				try {
					const user = await Prisma.user.findUnique({
						where: {
							email: profile.email,
						},
					});

					if (user) {
						return true;
					}

					throw new Error();
				} catch (error) {
					console.log(error);
					return false;
				}
			}

			return false;
		},
	},
});

export { handler as GET, handler as POST };
