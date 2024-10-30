import { User } from '@prisma/client';
import { create } from 'zustand';

type UserStore = {
	user: User | null;
	setUser: (user: User) => void;
	setAgree: () => void;
};

export const useUserStore = create<UserStore>()((set) => ({
	user: null,
	setUser: (user) =>
		set(() => ({
			user: user,
		})),
	setAgree: () =>
		set((state) => ({
			user: state.user && {
				...state.user,
				agreed: true,
			},
		})),
}));
