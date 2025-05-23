import Prisma from '@/database/database';

export async function POST(req: Request) {
	try {
		const request = await req.json();
		const email = req.headers.get('x-user-email');
		const { id } = request as {
			id: string;
		};

		const user = await Prisma.user.findUnique({
			where: {
				email: email!,
			},
		});

		if (!user || !email || !id) {
			return new Response('Bad Request', {
				status: 400,
			});
		}

		await Prisma.message.deleteMany({
			where: {
				conversationId: id,
			},
		});

		await Prisma.conversation.delete({
			where: {
				id: id,
				user: {
					email: email,
				},
			},
		});

		return Response.json({ message: 'Success' });
	} catch (error) {
		console.log(error);
		return new Response('Internal Server Error', {
			status: 500,
		});
	}
}
