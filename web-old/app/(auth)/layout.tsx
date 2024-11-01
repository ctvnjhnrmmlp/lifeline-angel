import { ReactNode } from '.pnpm/@types+react@18.3.12/node_modules/@types/react';

export default function Layout({
	children,
}: Readonly<{
	children: ReactNode;
}>) {
	return <>{children}</>;
}
