'use client';

import { Message } from '@prisma/client';
import Image from 'next/image';
import { PhotoProvider, PhotoView } from 'react-photo-view';

const UserImageMessageCard = ({ message }: { message: Message }) => {
	return (
		<PhotoProvider>
			{/* @ts-ignore */}
			<PhotoView src={message.content}>
				<Image
					src={`${message.content}`}
					height={400}
					width={400}
					alt='Wound image'
					className='ml-auto mr-0 rounded-3xl'
				/>
			</PhotoView>
		</PhotoProvider>
	);
};

export default UserImageMessageCard;
