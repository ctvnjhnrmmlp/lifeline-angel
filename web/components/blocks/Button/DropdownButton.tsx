'use client';

import React from 'react';

const DropdownButton = ({
	children,
	openModal,
}: {
	children: React.ReactNode;
	openModal: () => void;
}) => {
	return <button onClick={openModal}>{children}</button>;
};

export default DropdownButton;
