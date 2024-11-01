import { User } from '@prisma/client';
import client from './client';

const apiClient = client(process.env.NEXT_PUBLIC_LIFELINE_ANGEL_API_URL);

export const getUser = async (email: string): Promise<User | null> => {
	try {
		const response = await apiClient.post(
			'/api/user/get/id',
			{},
			{
				headers: {
					'Content-Type': 'application/json',
					'X-User-Email': email,
				},
			}
		);

		if (response.status === 200) {
			return response.data.user;
		}

		throw new Error(response.data);
	} catch (error) {
		return null;
	}
};

export const agree = async (email: string, id: string) => {
	try {
		const response = await apiClient.post(
			'/api/user/consent/agree',
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
			return true;
		}

		throw new Error(response.data);
	} catch (error) {
		return false;
	}
};
