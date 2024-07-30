import Nav from '@/components/layouts/Nav/Nav';
import Sidebar from '@/components/layouts/Sidebar/Sidebar';
import React from 'react';

export default function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			{/* <Nav /> */}
			<Sidebar />
			{children}
		</>
	);
}
