import { PrismaAdapter } from '.pnpm/@auth+prisma-adapter@2.7.2_@prisma+client@5.21.1_prisma@5.21.1_/node_modules/@auth/prisma-adapter';
import GoogleProvider from '.pnpm/next-auth@4.24.10_next@15.0.2_react-dom@19.0.0-rc-02c0e824-20241028_react@19.0.0-rc-02c0e824-_6v3ny5a5udmzoog3xss5rkgreu/node_modules/next-auth/providers/google';
import Prisma from '@/database/database';
import NextAuth from 'next-auth';
import { Adapter } from 'next-auth/adapters';

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
