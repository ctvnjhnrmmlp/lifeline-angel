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
				const userSession = await Prisma.user.findUnique({
					where: {
						// @ts-ignore
						email: session.user.email,
					},
				});
				// @ts-ignore
				session.user.email = userSession.email;
			}

			return session;
		},
		async signIn({ profile }) {
			if (profile) {
				try {
					let user = await Prisma.user.findUnique({
						where: {
							email: profile.email,
						},
					});

					if (user) {
						return user;
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

// import { signIn } from '@/services/bittok/auth';
// import NextAuth from 'next-auth';
// import GoogleProvider from 'next-auth/providers/google';

// const handler = NextAuth({
// 	providers: [
// 		GoogleProvider({
// 			clientId: `${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}`,
// 			clientSecret: `${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET}`,
// 			httpOptions: {
// 				timeout: 40000,
// 			},
// 			authorization: {
// 				params: {
// 					prompt: 'consent',
// 					access_type: 'offline',
// 					response_type: 'code',
// 				},
// 			},
// 		}),
// 	],
// 	callbacks: {
// 		async jwt({ token, account, user }) {
// 			if (account) {
// 				const response = await signIn(account);

// 				token = Object.assign({}, token, {
// 					id_token: account.id_token,
// 				});
// 				token = Object.assign({}, token, {
// 					myToken: response.authToken,
// 				});
// 				token = Object.assign({}, token, {
// 					user: response.user,
// 				});
// 			}

// 			return token;
// 		},
// 		async session({ session, token }) {
// 			if (session) {
// 				session = Object.assign({}, session, {
// 					id_token: token.id_token,
// 				});
// 				session = Object.assign({}, session, {
// 					authToken: token.myToken,
// 				});
// 				session = Object.assign({}, session, {
// 					user: {
// 						...token.user,
// 					},
// 				});
// 			}

// 			return session;
// 		},
// 	},
// });

// export { handler as GET, handler as POST };
