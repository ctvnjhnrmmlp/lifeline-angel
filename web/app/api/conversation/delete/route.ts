import Prisma from '@/database/database';

export async function POST(req: Request) {
	try {
		const request = await req.json();
		const email = req.headers.get('x-user-email');
		const { id } = request;

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

		const conversation = await Prisma.conversation.delete({
			where: {
				id: id,
			},
		});

		return Response.json({ message: 'Success', conversation });
	} catch (error) {
		console.log(error);
		return new Response('Internal Server Error', {
			status: 500,
		});
	}
}
