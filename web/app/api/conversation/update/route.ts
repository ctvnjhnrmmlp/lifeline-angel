import Prisma from '@/database/database';

export async function POST(req: Request) {
	try {
		const request = await req.json();
		const email = req.headers.get('x-user-email');
		const { id, title } = request;

		const user = await Prisma.user.findUnique({
			where: {
				email: email as string,
			},
		});

		if (!user || !email) {
			return new Response('Bad Request', {
				status: 400,
			});
		}

		await Prisma.conversation.update({
			where: {
				id: id,
			},
			data: {
				title: title,
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
