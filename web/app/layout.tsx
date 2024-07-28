import '../styles/globals.css';

import FONTS from '@/configurations/fonts';
import { metatags } from '@/configurations/metatags';
import type { Metadata } from 'next';
import Providers from './providers';

export const metadata: Metadata = metatags;

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<body className={`${FONTS.alpha.className} no-scrollbar`}>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
