'use client';

import { NextUIProvider } from '@nextui-org/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { useRouter } from 'next/navigation';
import React from 'react';

export default function Providers({ children }: { children: React.ReactNode }) {
	const queryClient = new QueryClient();
	const router = useRouter();

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
