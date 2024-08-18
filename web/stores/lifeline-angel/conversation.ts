import { Conversation } from '@prisma/client';
import { create } from 'zustand';

type MultipleConversationStore = {
	conversations: Conversation[];
	setConversations: (conversations: Conversation[]) => void;
	addConversation: (cid: string) => void;
	deleteConversation: (cid: string) => void;
};

type SingleConversationStore = {
	conversation: Conversation | null;
	setConversation: (conversation: Conversation) => void;
};

export const useMultipleConversationStore = create<MultipleConversationStore>()(
	(set) => ({
		conversations: [],
		setConversations: (conversations) =>
			set(() => ({ conversations: conversations })),
		addConversation: (cid) =>
			set((state) => ({
				conversations: [
					...state.conversations,
					{
						id: cid,
						title: '',
						userId: '',
						createdAt: new Date(),
						updatedAt: new Date(),
					},
				],
			})),
		deleteConversation: (cid) =>
			set((state) => ({
				conversations: state.conversations.filter(
					(conversation) => conversation.id !== cid
				),
			})),
	})
);

export const useSingleConversationStore = create<SingleConversationStore>()(
	(set) => ({
		conversation: null,
		setConversation: (conversation) =>
			set(() => ({ conversation: conversation })),
	})
);
