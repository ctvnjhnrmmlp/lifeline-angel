import client from './client';

export const addConversation = async (email: string) => {
	try {
		const response = await client.post('/api/conversation/add', {
			headers: {
				'x-user-email': email,
			},
		});

		console.log(response);

		if (response.status === 200) {
			return response;
		}

		throw new Error();
	} catch (error) {
		console.error(error);
		return false;
	}
};

export const getConversation = async () => {};

export const deleteConversation = async () => {};

export const updateConversation = async (
	email: string,
	conversationId: string,
	title: string
) => {
	try {
		const response = await client.post(
			'/api/conversation/update',
			{
				conversationId,
				title,
			},
			{
				headers: {
					'x-user-email': email,
				},
			}
		);

		if (response.status === 200) {
			return response;
		}

		throw new Error();
	} catch (error) {
		console.error(error);
		return false;
	}
};
