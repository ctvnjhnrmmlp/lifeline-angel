'use client';

import { convertDateTo24HourTimeFormat } from '@/utilities/functions';
import { Message } from '@prisma/client';

const TextMessageCard = ({ message }: { message: Message }) => {
	return (
		<div className='flex flex-col space-y-2'>
			<div
				key={message.id}
				className='bg-background outline outline-1 outline-zinc-200 dark:outline-zinc-800 rounded-3xl min-w-4/12 ml-auto mr-0'
			>
				<div className='cursor-pointer p-4'>
					<p className='text-lg text-foreground tracking-tight leading-none text-ellipsis text-balance text-center'>
						{/* @ts-expect-error: must be corrected properly */}
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
