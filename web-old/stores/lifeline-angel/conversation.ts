import { Conversation } from '.pnpm/@prisma+client@5.21.1_prisma@5.21.1/node_modules/@prisma/client/default';
import { create } from '.pnpm/zustand@5.0.1_@types+react@18.3.12_react@19.0.0-rc-02c0e824-20241028/node_modules/zustand/esm/index.mjs';

type MultipleConversationStore = {
	conversations: Conversation[];
	setConversations: (conversations: Conversation[]) => void;
	searchConversations: (query: string) => void;
	addConversation: (cid: string) => void;
	updateConversation: (cid: string, title: string) => void;
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
					{
						id: cid,
						title: '',
						userId: '',
						createdAt: new Date(),
						updatedAt: new Date(),
					},
					...state.conversations,
				],
			})),
		searchConversations: (query) =>
			set((state) => ({
				conversations: state.conversations.filter(
					(conversation) => conversation.title === query
				),
			})),
		updateConversation: (cid, title) =>
			set((state) => ({
				conversations: state.conversations.map((conversation) => {
					if (conversation.id === cid) {
						return {
							...conversation,
							title: title,
						};
					} else {
						return conversation;
					}
				}),
			})),
		deleteConversation: (cid) =>
			set((state) => ({
				conversations: state.conversations.filter(
					(conversation) => conversation.id !== cid
				),
			})),
	})
);

export const useTemporaryMultipleConversationStore =
	create<MultipleConversationStore>()((set) => ({
		conversations: [],
		setConversations: (conversations) =>
			set(() => ({ conversations: conversations })),
		addConversation: (cid) =>
			set((state) => ({
				conversations: [
					{
						id: cid,
						title: '',
						userId: '',
						createdAt: new Date(),
						updatedAt: new Date(),
					},
					...state.conversations,
				],
			})),
		searchConversations: (query) =>
			set((state) => ({
				conversations: state.conversations.filter(
					(conversation) => conversation.title === query
				),
			})),
		updateConversation: (cid, title) =>
			set((state) => ({
				conversations: state.conversations.map((conversation) => {
					if (conversation.id === cid) {
						return {
							...conversation,
							title: title,
						};
					} else {
						return conversation;
					}
				}),
			})),
		deleteConversation: (cid) =>
			set((state) => ({
				conversations: state.conversations.filter(
					(conversation) => conversation.id !== cid
				),
			})),
	}));

export const useSingleConversationStore = create<SingleConversationStore>()(
	(set) => ({
		conversation: null,
		setConversation: (conversation) =>
			set(() => ({ conversation: conversation })),
	})
);
