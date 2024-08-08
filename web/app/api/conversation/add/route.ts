import Prisma from '@/database/database';

export async function POST(req: Request) {
	try {
		const email = req.headers.get('x-user-email');

		const user = await Prisma.user.findUnique({
			where: {
				email: email,
			},
		});

		if (!user) {
			return new Response('Bad Request', {
				status: 400,
			});
		}

		const conversation = await Prisma.conversation.create({
			data: {
				title: '',
			},
		});

		return Response.json({ message: 'Success', conversation });
	} catch (error) {
		return new Response('Internal Server Error', {
			status: 500,
		});
	}
}
