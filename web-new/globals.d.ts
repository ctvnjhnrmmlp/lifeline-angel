import { User } from '@prisma/client';
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
