'use client';

import { Message } from '@prisma/client';
import Image from 'next/image';
import { PhotoProvider, PhotoView } from 'react-photo-view';

const UserImageMessageCard = ({ message }: { message: Message }) => {
	return (
		<div
			key={message.id}
			className='bg-background outline outline-1 outline-zinc-200 dark:outline-zinc-800 rounded-3xl min-w-1/12 ml-auto mr-0'
		>
			<div className='cursor-pointer p-6'>
				<PhotoProvider>
					{/* @ts-ignore */}
					<PhotoView src={message.content}>
						<Image
							src={`${message.content}`}
							height={300}
							width={300}
							alt='Wound image'
							className='mx-auto'
						/>
					</PhotoView>
				</PhotoProvider>
			</div>
		</div>
	);
};

export default UserImageMessageCard;
