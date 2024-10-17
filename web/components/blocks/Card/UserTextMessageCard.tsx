'use client';

import { convertDateTo24HourTimeFormat } from '@/utilities/functions';
import { Message } from '@prisma/client';

const TextMessageCard = ({ message }: { message: Message }) => {
	return (
		<div className='flex flex-col space-y-2'>
			<div
				key={message.id}
				className='backdrop-blur-2xl bg-foreground/5 rounded-2xl min-w-4/12 ml-auto mr-0'
			>
				<div className='cursor-pointer p-4'>
					<p className='text-lg text-foreground tracking-tight leading-none text-ellipsis text-balance text-center'>
						{/* @ts-ignore */}
						{message.content}
					</p>
				</div>
			</div>
			<div>
				<p className='text-xs text-foreground tracking-tight leading-none text-ellipsis text-balance text-right'>
					{convertDateTo24HourTimeFormat(message.createdAt.toString())}
				</p>
			</div>
		</div>
	);
};

export default TextMessageCard;
