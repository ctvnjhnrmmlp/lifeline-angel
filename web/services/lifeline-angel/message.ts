import client from './client';

const apiClient = client(
	process.env.NEXT_PUBLIC_LIFELINE_ANGEL_API_URL as string
);

export const getMessages = async (email: string, id: string) => {
	try {
		const response = await apiClient.post(
			'/api/message/get',
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
		console.error(error);
		return false;
	}
};

export const addMessage = async (
	email: string,
	id: string,
	message: string
) => {
	try {
		const response = await apiClient.post(
			'/api/message/add',
			{
				id,
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
		console.error(error);
		return false;
	}
};

export const deleteMessage = async (email: string, id: string) => {
	try {
		const response = await apiClient.post(
			'/api/message/delete',
			{ id },
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

		throw new Error();
	} catch (error) {
		console.error(error);
		return false;
	}
};
