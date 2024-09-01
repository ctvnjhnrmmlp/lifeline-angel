import { StringSchema } from 'yup';
import client from './client';

const apiClient = client(process.env.NEXT_PUBLIC_LIFELINE_ANGEL_API_URL);

export const addConversation = async (email: StringSchema) => {
	try {
		const response = await apiClient.post('/api/consent/agree', {
			headers: {
				'Content-Type': 'application/json',
				'X-User-Email': email,
			},
		});

		if (response.status === 200) {
			return true;
		}

		throw new Error();
	} catch (error) {
		return false;
	}
};
