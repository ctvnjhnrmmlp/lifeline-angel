import Conversation from '@prisma/client';
import { create } from 'zustand';

const useConversationStore = create((set) => ({
	conversations: {},
	setConversation: () => set((state) => ({ conversations: state })),
}));

export default useConversationStore;
