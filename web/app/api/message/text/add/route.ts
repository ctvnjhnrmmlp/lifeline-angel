import Prisma from '@/database/database';
import client from '@/services/lifeline-angel/client';

const apiClient = client(process.env.NEXT_PUBLIC_LIFELINE_ANGEL_API_MODEL_URL);

const classifyText = async (text: string) => {
	try {
		const response = await apiClient.post(
			'/api/talk',
			JSON.stringify({
				message: text,
			}),
			{
				headers: {
					'Content-Type': 'application/json',
				},
			}
		);

		if (response.status === 200) {
			return response.data;
		}

		throw new Error();
	} catch (error) {
		console.log(error);
	}
};

export async function POST(req: Request) {
	try {
		const request = await req.json();
		const email = req.headers.get('x-user-email') as string;
		const message = request.message;
		const { cid, mid } = request as {
			cid: string;
			mid: string;
		};

		const user = await Prisma.user.findUnique({
			where: {
				email: email,
			},
		});

		if (!user || !email || !cid || !mid || !message) {
			return new Response('Bad Request', {
				status: 400,
			});
		}

		const textPrediction = await classifyText(message);

		await Prisma.conversation.update({
			where: {
				id: cid,
				user: {
					email: email,
				},
			},
			data: {
				title: message,
				messages: {
					create: [
						{
							id: mid,
							content: message,
							from: 'user',
						},
						{
							content: textPrediction.response,
							from: 'model',
						},
					],
				},
			},
		});

		return Response.json({
			message: 'Success',
			answer: textPrediction.response,
		});
	} catch (error) {
		console.log(error);
		return new Response('Internal Server Error', {
			status: 500,
		});
	}
}
