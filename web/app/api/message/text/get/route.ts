import Prisma from '@/database/database';

export async function POST(req: Request) {
	try {
		const request = await req.json();
		const email = req.headers.get('x-user-email') as string;
		const id = request.id as string;

		const user = await Prisma.user.findUnique({
			where: {
				email: email,
			},
		});

		if (!user || !email || !id) {
			return new Response('Bad Request', {
				status: 400,
			});
		}

		const messages = await Prisma.message.findMany({
			where: {
				conversationId: id,
			},
		});

		return Response.json({ message: 'Success', messages });
	} catch (error) {
		return new Response('Internal Server Error', {
			status: 500,
		});
	}
}
