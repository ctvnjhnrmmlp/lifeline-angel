import { Conversation } from '@prisma/client';
import client from './client';

const apiClient = client(process.env.NEXT_PUBLIC_LIFELINE_ANGEL_API_URL);

export const getConversations = async (
	email: string
): Promise<Conversation[]> => {
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
		return [];
	}
};

export const getConversation = async (
	email: string,
	id: string
): Promise<Conversation | null> => {
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
		return null;
	}
};

export const searchConversations = async (
	email: string,
	query: string
): Promise<Conversation[]> => {
	try {
		const response = await apiClient.post(
			'/api/conversation/search',
			{ query },
			{
				headers: {
					'Content-Type': 'application/json',
					'X-User-Email': email,
				},
			}
		);

		if (response.status === 200) {
			return response.data.conversations;
		}

		throw new Error();
	} catch (error) {
		return [];
	}
};

export const addConversation = async (email: string, id: string) => {
	try {
		const response = await apiClient.post(
			'/api/conversation/add',
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

		throw new Error();
	} catch (error) {
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
		return false;
	}
};
