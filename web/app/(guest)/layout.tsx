'use client';

import Sidebar from '@/components/layouts/Sidebar/Sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { ReactNode } from 'react';

export default function Layout({
	children,
}: Readonly<{
	children: ReactNode;
}>) {
	return (
		<SidebarProvider>
			<Sidebar>{children}</Sidebar>
		</SidebarProvider>
	);
}
