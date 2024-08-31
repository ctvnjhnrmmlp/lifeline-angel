import Sidebar from '@/components/layouts/Sidebar/Sidebar';
import { ReactNode } from 'react';

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
