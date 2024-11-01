'use client';

import {
	QueryClient,
	QueryClientProvider,
} from '.pnpm/@tanstack+react-query@5.59.16_react@19.0.0-rc-02c0e824-20241028/node_modules/@tanstack/react-query/build/modern';
import { ReactNode } from '.pnpm/@types+react@18.3.12/node_modules/@types/react';
import { SessionProvider } from '.pnpm/next-auth@4.24.10_next@15.0.2_react-dom@19.0.0-rc-02c0e824-20241028_react@19.0.0-rc-02c0e824-_6v3ny5a5udmzoog3xss5rkgreu/node_modules/next-auth/react';
import { ThemeProvider as NextThemesProvider } from '.pnpm/next-themes@0.3.0_react-dom@19.0.0-rc-02c0e824-20241028_react@19.0.0-rc-02c0e824-20241028__re_4bedllgkyhydj3n536r2ahbiau/node_modules/next-themes/dist';
import { NextUIProvider } from '@nextui-org/react';

export default function Providers({ children }: { children: ReactNode }) {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				refetchOnWindowFocus: false,
			},
		},
	});

	return (
		<SessionProvider>
			<QueryClientProvider client={queryClient}>
				<NextUIProvider>
					<NextThemesProvider
						attribute='class'
						defaultTheme='lifelineAngelDark'
						themes={['lifelineAngelDark', 'dark']}
					>
						{children}
					</NextThemesProvider>
				</NextUIProvider>
			</QueryClientProvider>
		</SessionProvider>
	);
}
