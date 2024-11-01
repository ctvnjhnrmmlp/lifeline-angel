import { User } from '.pnpm/@prisma+client@5.21.1_prisma@5.21.1/node_modules/@prisma/client/default';
import { create } from '.pnpm/zustand@5.0.1_@types+react@18.3.12_react@19.0.0-rc-02c0e824-20241028/node_modules/zustand/esm/index.mjs';

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
