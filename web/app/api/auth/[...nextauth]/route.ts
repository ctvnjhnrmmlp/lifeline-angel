import Prisma from '@/database/database';
import { PrismaAdapter } from '@auth/prisma-adapter';
import NextAuth from 'next-auth';
import { Adapter } from 'next-auth/adapters';
import GoogleProvider from 'next-auth/providers/google';

const handler = NextAuth({
	adapter: PrismaAdapter(Prisma) as Adapter,
	pages: {
		signIn: '/signin',
	},
	providers: [
		GoogleProvider({
			clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
			clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
		}),
	],
	callbacks: {
		async signIn({ profile }) {
			if (profile) {
				try {
					await Prisma.user.findUnique({
						where: {
							email: profile.email,
						},
					});

					return true;
				} catch (error) {
					console.log(error);
					return false;
				}
			}

			return false;
		},
		async session({ session }) {
			if (session.user) {
				const user = await Prisma.user.findUnique({
					where: {
						// @ts-expect-error
						email: session.user.email,
					},
				});

				// @ts-expect-error
				session.user = user;
			}

			return session;
		},
	},
});

export { handler as GET, handler as POST };
