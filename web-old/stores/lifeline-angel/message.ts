import { Message } from '.pnpm/@prisma+client@5.21.1_prisma@5.21.1/node_modules/@prisma/client/default';
import { create } from '.pnpm/zustand@5.0.1_@types+react@18.3.12_react@19.0.0-rc-02c0e824-20241028/node_modules/zustand/esm/index.mjs';

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
						from: 'user',
						createdAt: new Date(),
						updatedAt: new Date(),
					},
				],
			})),
	})
);
