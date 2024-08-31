'use client';

import { ReactNode } from 'react';

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
