import { create } from 'zustand';

const ConversationStore = create((set) => ({
	conversations: {},
}));

export default ConversationStore;
