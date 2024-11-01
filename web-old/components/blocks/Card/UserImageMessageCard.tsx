'use client';

import { Message } from '.pnpm/@prisma+client@5.21.1_prisma@5.21.1/node_modules/@prisma/client/default';
import Image from '.pnpm/next@15.0.2_react-dom@19.0.0-rc-02c0e824-20241028_react@19.0.0-rc-02c0e824-20241028__react@19.0.0-rc-02c0e824-20241028/node_modules/next/image';
import {
	PhotoProvider,
	PhotoView,
} from '.pnpm/react-photo-view@1.2.6_react-dom@19.0.0-rc-02c0e824-20241028_react@19.0.0-rc-02c0e824-2024102_spdqb4eqhi3seyyw7n6uskup6y/node_modules/react-photo-view/dist';

const UserImageMessageCard = ({ message }: { message: Message }) => {
	return (
		<div
			key={message.id}
			className='backdrop-blur-2xl bg-foreground/5 rounded-2xl min-w-1/12 ml-auto mr-0'
		>
			<div className='cursor-pointer p-6'>
				<PhotoProvider>
					{/* @ts-expect-error */}
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
