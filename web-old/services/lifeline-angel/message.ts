import { Message } from '.pnpm/@prisma+client@5.21.1_prisma@5.21.1/node_modules/@prisma/client/default';
import client from './client';

const apiClient = client(process.env.NEXT_PUBLIC_LIFELINE_ANGEL_API_URL);

export const getMessages = async (
	email: string,
	id: string
): Promise<Message[]> => {
	try {
		const response = await apiClient.post(
			'/api/message/text/get',
			{
				id,
			},
			{
				headers: {
					'Content-Type': 'application/json',
					'X-User-Email': email,
				},
			}
		);

		if (response.status === 200) {
			return response.data.messages;
		}

		throw new Error();
	} catch (error) {
		return [];
	}
};

export const addTextMessage = async (
	email: string,
	cid: string,
	mid: string,
	message: string
) => {
	try {
		const response = await apiClient.post(
			'/api/message/text/add',
			{
				cid,
				mid,
				message,
			},
			{
				headers: {
					'Content-Type': 'application/json',
					'X-User-Email': email,
				},
			}
		);

		if (response.status === 200) {
			return response.data.answer;
		}

		throw new Error();
	} catch (error) {
		return false;
	}
};

export const addImageMessage = async (
	email: string,
	cid: string,
	mid: string,
	file: File | string
) => {
	try {
		const formData = new FormData();

		formData.append('cid', cid);
		formData.append('mid', mid);
		formData.append('file', file);

		const response = await apiClient.post('/api/message/image/add', formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
				'X-User-Email': email,
			},
		});

		if (response.status === 200) {
			return response.data;
		}

		throw new Error();
	} catch (error) {
		return false;
	}
};
