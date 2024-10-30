import Prisma from '@/database/database';

export async function POST(req: Request) {
	try {
		const email = req.headers.get('x-user-email') as string;

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

		return Response.json({ message: 'Success', user });
	} catch (error) {
		return new Response('Internal Server Error', {
			status: 500,
		});
	}
}
