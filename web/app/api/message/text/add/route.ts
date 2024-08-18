import Prisma from '@/database/database';

export async function POST(req: Request) {
	try {
		const request = await req.json();
		const email = req.headers.get('x-user-email');
		const message = request.message;
		const { cid, mid } = request;

		const user = await Prisma.user.findUnique({
			where: {
				email: email as string,
			},
		});

		if (!user || !email || !cid || !mid || !message) {
			return new Response('Bad Request', {
				status: 400,
			});
		}

		const res = await fetch('http://localhost:8000/api/talk', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ message: message }),
		});

		const data = await res.json();

		const conversation = await Prisma.conversation.update({
			where: {
				id: cid,
			},
			data: {
				messages: {
					create: [
						{
							id: mid,
							content: message,
						},
						{
							content: data.response,
						},
					],
				},
			},
		});

		/////////

		// const conversation = await Prisma.conversation.create({
		// 	data: {
		// 		title: '',
		// 		userId: user.id,
		// 	},
		// });

		// await Prisma.user.update({
		// 	where: {
		// 		id: user.id,
		// 	},
		// 	data: {
		// 		conversation: {
		// 			connect: {
		// 				id: conversation.id,
		// 			},
		// 		},
		// 	},
		// });

		/////////

		return Response.json({ message: 'Success', answer: data.response });
	} catch (error) {
		console.log(error);
		return new Response('Internal Server Error', {
			status: 500,
		});
	}
}
