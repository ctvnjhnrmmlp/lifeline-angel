import { User } from '.pnpm/@prisma+client@5.21.1_prisma@5.21.1/node_modules/@prisma/client/default';
import NextAuth from 'next-auth';

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			[key: string]: string;
		}
	}
}

declare module 'next-auth' {
	interface Session {
		user: User & DefaultSession['user'];
	}
}
