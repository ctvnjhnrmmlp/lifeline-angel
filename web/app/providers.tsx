'use client';

import { SidebarProvider } from '@/components/ui/sidebar';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { ReactNode } from 'react';

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
				<NextThemesProvider
					attribute='class'
					defaultTheme='system'
					enableSystem
					// disableTransitionOnChange
				>
					<SidebarProvider>
						<TooltipProvider>{children}</TooltipProvider>
					</SidebarProvider>
				</NextThemesProvider>
			</QueryClientProvider>
		</SessionProvider>
	);
}
