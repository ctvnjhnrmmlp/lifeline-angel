import { ReactNode } from '.pnpm/@types+react@18.3.12/node_modules/@types/react';
import Sidebar from '@/components/layouts/Sidebar/Sidebar';

export default function Layout({
	children,
}: Readonly<{
	children: ReactNode;
}>) {
	return (
		<>
			<Sidebar />
			{children}
		</>
	);
}
