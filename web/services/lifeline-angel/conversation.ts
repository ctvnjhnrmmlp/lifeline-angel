import client from './client';

const apiClient = client(
	process.env.NEXT_PUBLIC_LIFELINE_ANGEL_API_URL as string
);

export const getConversations = async (email: string) => {
	try {
		const response = await apiClient.get('/api/conversation/get', {
			headers: {
				'Content-Type': 'application/json',
				'X-User-Email': email,
			},
		});

		if (response.status === 200) {
			return response.data.conversations;
		}

		throw new Error();
	} catch (error) {
		console.error(error);
		return false;
	}
};

export const getConversation = async (email: string, id: string) => {
	try {
		const response = await apiClient.post(
			'/api/conversation/get/id',
			{ id },
			{
				headers: {
					'Content-Type': 'application/json',
					'X-User-Email': email,
				},
			}
		);

		if (response.status === 200) {
			return response.data.conversation;
		}

		throw new Error();
	} catch (error) {
		console.error(error);
		return false;
	}
};

export const addConversation = async (email: string) => {
	try {
		const response = await apiClient.post('/api/conversation/add', {
			headers: {
				'Content-Type': 'application/json',
				'X-User-Email': email,
			},
		});

		if (response.status === 200) {
			return response;
		}

		throw new Error();
	} catch (error) {
		console.error(error);
		return false;
	}
};

export const updateConversation = async (
	email: string,
	id: string,
	title: string
) => {
	try {
		const response = await apiClient.post(
			'/api/conversation/update',
			{
				id,
				title,
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

export const deleteConversation = async (email: string, id: string) => {
	try {
		const response = await apiClient.post(
			'/api/conversation/delete',
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
