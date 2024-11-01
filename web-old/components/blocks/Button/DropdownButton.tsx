'use client';

import { ReactNode } from '.pnpm/@types+react@18.3.12/node_modules/@types/react';

const DropdownButton = ({
	children,
	openModal,
}: {
	children: ReactNode;
	openModal: () => void;
}) => {
	return <button onClick={openModal}>{children}</button>;
};

export default DropdownButton;
