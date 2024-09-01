import Prisma from '@/database/database';

export async function POST(req: Request) {
	try {
		const request = await req.json();
		const email = req.headers.get('x-user-email') as string;
		const { query } = request as {
			query: string;
		};

		const user = await Prisma.user.findUnique({
			where: {
				email: email,
			},
		});

		if (!user || !email || !query) {
			return new Response('Bad Request', {
				status: 400,
			});
		}

		const conversations = await Prisma.conversation.findMany({
			where: {
				user: {
					email: email,
				},
				title: {
					contains: query,
					mode: 'insensitive',
				},
			},
		});

		return Response.json({ message: 'Success', conversations });
	} catch (error) {
		console.log(error);
		return new Response('Internal Server Error', {
			status: 500,
		});
	}
}
