import Prisma from '@/database/database';
import client from '@/services/lifeline-angel/client';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

const apiClient = client(
	process.env.NEXT_PUBLIC_LIFELINE_ANGEL_API_MODEL_URL as string
);

const s3Client = new S3Client({
	region: process.env.AWS_REGION as string,
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
	},
});

const uploadFile = async (file: Buffer, fileName: string) => {
	try {
		const response = await s3Client.send(
			new PutObjectCommand({
				Bucket: process.env.AWS_BUCKET_NAME,
				Key: `${fileName}`,
				Body: file,
				ContentType: 'image/*',
			})
		);

		console.log(response);
	} catch (error) {
		console.error('Error uploading file:', error);
		throw error;
	}
};

const classifyImage = async (file: File) => {
	try {
		const imageFormData = new FormData();

		imageFormData.append('file', file);

		const response = await apiClient.post('/api/classify', imageFormData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});

		if (response.status === 200) {
			return response.data;
		}

		throw new Error();
	} catch (error) {
		console.error(error);
		return false;
	}
};

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
		console.error(error);
	}
};

export async function POST(req: Request) {
	try {
		const formData = await req.formData();
		const email = req.headers.get('x-user-email');
		const cid = formData.get('cid') as string;
		const mid = formData.get('mid') as string;
		const file = formData.get('file') as File;

		const user = await Prisma.user.findUnique({
			where: {
				email: email as string,
			},
		});

		if (!user || !email || !cid || !mid || !file) {
			return new Response('Bad Request', {
				status: 400,
			});
		}

		await uploadFile(Buffer.from(await file.arrayBuffer()), file.name);

		const imagePrediction = await classifyImage(file);

		const textPrediction = await classifyText(imagePrediction.prediction);

		await Prisma.conversation.update({
			where: {
				id: cid,
			},
			data: {
				title: imagePrediction.prediction,
				messages: {
					create: [
						{
							content: `https://lifeline-angel.s3.ap-southeast-2.amazonaws.com/${file.name}`,
							from: 'user',
						},
						{
							id: mid,
							content: imagePrediction.prediction,
							from: 'model',
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
