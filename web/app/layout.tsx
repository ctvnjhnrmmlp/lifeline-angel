import FONTS from '@/configurations/fonts';
import { metatags } from '@/configurations/metatags';
import '@/styles/globals.css';
import type { Metadata } from 'next';
import 'react-photo-view/dist/react-photo-view.css';
import Providers from './providers';

export const metadata: Metadata = metatags;

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en' className='select-none'>
			<body className={`${FONTS.alpha.className} no-scrollbar`}>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
