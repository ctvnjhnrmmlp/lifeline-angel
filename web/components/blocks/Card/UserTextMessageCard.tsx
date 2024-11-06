'use client';

import { convertDateTo24HourTimeFormat } from '@/utilities/functions';
import { Message } from '@prisma/client';

const TextMessageCard = ({ message }: { message: Message }) => {
	return (
		<div className='flex flex-col space-y-2'>
			<div className='bg-foreground outline outline-1 outline-zinc-200 dark:outline-zinc-800 rounded-3xl min-w-4/12 ml-auto mr-0 cursor-pointer py-2 px-5'>
				<p className='text-sm md:text-md lg:text-lg text-background tracking-tight text-ellipsis text-balance text-center'>
					{/* @ts-expect-error: must be corrected properly */}
					{message.content}
				</p>
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
