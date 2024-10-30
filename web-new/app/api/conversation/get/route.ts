import Prisma from '@/database/database';

export async function GET(req: Request) {
	try {
		const email = req.headers.get('X-User-Email') as string;

		const user = await Prisma.user.findUnique({
			where: {
				email: email,
			},
		});

		if (!user || !email) {
			return new Response('Bad Request', {
				status: 400,
			});
		}

		const conversations = await Prisma.conversation.findMany({
			where: {
				user: {
					email: email,
				},
			},
			orderBy: {
				createdAt: 'desc',
			},
		});

		return Response.json({ message: 'Success', conversations });
	} catch (error) {
		return new Response('Internal Server Error', {
			status: 500,
		});
	}
}
