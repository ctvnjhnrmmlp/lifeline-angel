'use client';

import { NextUIProvider } from '@nextui-org/react';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import React from 'react';

export default function Providers({ children }: { children: React.ReactNode }) {
	return (
		<SessionProvider>
			<NextUIProvider>
				<NextThemesProvider
					attribute='class'
					defaultTheme='lifelineAngelDark'
					themes={['lifelineAngelDark', 'dark']}
				>
					{children}
				</NextThemesProvider>
			</NextUIProvider>
		</SessionProvider>
	);
}
