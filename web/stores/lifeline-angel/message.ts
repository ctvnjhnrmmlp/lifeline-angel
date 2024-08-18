import { Message } from '@prisma/client';
import { create } from 'zustand';

type MultipleMessageStore = {
	messages: Message[];
	setMessages: (messages: Message[]) => void;
	addMessage: (cid: string, mid: string, message: string) => void;
};

export const useMultipleMessageStore = create<MultipleMessageStore>()(
	(set) => ({
		messages: [],
		setMessages: (messages) =>
			set(() => ({
				messages: messages,
			})),
		addMessage: (cid, mid, message) =>
			set((state) => ({
				messages: state.messages && [
					...state.messages,
					{
						id: mid,
						content: message,
						conversationId: cid,
						createdAt: new Date(),
						updatedAt: new Date(),
					},
				],
			})),
	})
);
