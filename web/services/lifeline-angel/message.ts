import client from './client';

export const getMessages = async (email: string) => {
	try {
		const response = await client.get('/api/message/get', {
			headers: {
				'Content-Type': 'application/json',
				'X-User-Email': email,
			},
		});

		if (response.status === 200) {
			return response.data.messages;
		}

		throw new Error();
	} catch (error) {
		console.error(error);
		return false;
	}
};

export const addMessage = async (email: string, message: string) => {
	try {
		const response = await client.post(
			'/api/message/add',
			{
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
			return true;
		}

		throw new Error();
	} catch (error) {
		console.error(error);
		return false;
	}
};

export const deleteMessage = async (email: string, id: string) => {
	try {
		const response = await client.post(
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
