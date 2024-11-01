'use client';

import { useQuery } from '.pnpm/@tanstack+react-query@5.59.16_react@19.0.0-rc-02c0e824-20241028/node_modules/@tanstack/react-query/build/modern';
import {
	ReactNode,
	useEffect,
} from '.pnpm/@types+react@18.3.12/node_modules/@types/react';
import { useSession } from '.pnpm/next-auth@4.24.10_next@15.0.2_react-dom@19.0.0-rc-02c0e824-20241028_react@19.0.0-rc-02c0e824-_6v3ny5a5udmzoog3xss5rkgreu/node_modules/next-auth/react';
import { getUser } from '@/services/lifeline-angel/user';
import { useUserStore } from '@/stores/lifeline-angel/user';

export default function Containers({ children }: { children: ReactNode }) {
	const { data: session } = useSession();
	const { user: userLocal, setUser: setUserLocal } = useUserStore();

	const { data: userServer, status: userServerStatus } = useQuery({
		queryKey: ['getUser'],
		refetchOnWindowFocus: false,
		queryFn: async () => await getUser(session?.user.email),
	});

	useEffect(() => {
		if (userServerStatus === 'success' && userServer && !userLocal) {
			setUserLocal(userServer);
		}
	}, [userServer]);

	return <>{children}</>;
}
