import { PrismaClient } from '.pnpm/@prisma+client@5.21.1_prisma@5.21.1/node_modules/@prisma/client/default';

const prismaClientSingleton = () => {
	return new PrismaClient();
};

declare const globalThis: {
	prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const Prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default Prisma;

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = Prisma;
