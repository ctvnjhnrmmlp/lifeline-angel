import Prisma from '@/database/database';

export async function POST(req: Request) {
	const formData = await req.formData();
	const conversation = await Prisma.conversation.create({});

	return Response.json({ message: 'Yo' });
}
