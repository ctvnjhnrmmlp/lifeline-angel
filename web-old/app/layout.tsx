import type { Metadata } from '.pnpm/next@15.0.2_react-dom@19.0.0-rc-02c0e824-20241028_react@19.0.0-rc-02c0e824-20241028__react@19.0.0-rc-02c0e824-20241028/node_modules/next';
import Content from '@/components/compounds/Content/Content';
import FONTS from '@/configurations/fonts';
import { METADATA } from '@/configurations/metadata';
import '@/styles/globals.css';
import 'react-photo-view/dist/react-photo-view.css';
import Containers from './containers';
import Providers from './providers';

export const metadata: Metadata = METADATA;

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en' className='select-none'>
			<body className={`${FONTS.alpha.className} antialiased no-scrollbar`}>
				<Providers>
					<Containers>
						<Content>{children}</Content>
					</Containers>
				</Providers>
			</body>
		</html>
	);
}
