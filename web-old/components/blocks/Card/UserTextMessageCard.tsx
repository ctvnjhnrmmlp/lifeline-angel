'use client';

import { Message } from '.pnpm/@prisma+client@5.21.1_prisma@5.21.1/node_modules/@prisma/client/default';
import { convertDateTo24HourTimeFormat } from '@/utilities/functions';

const TextMessageCard = ({ message }: { message: Message }) => {
	return (
		<div className='flex flex-col space-y-2'>
			<div
				key={message.id}
				className='bg-background border-foreground/20 border-1 rounded-xl min-w-4/12 ml-auto mr-0'
			>
				<div className='cursor-pointer p-4'>
					<p className='text-lg text-foreground tracking-tight leading-none text-ellipsis text-balance text-center'>
						{/* @ts-expect-error */}
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
