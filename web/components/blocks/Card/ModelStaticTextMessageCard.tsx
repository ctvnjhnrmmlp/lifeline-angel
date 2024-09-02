'use client';

import { convertTo24HourTimeFormat } from '@/utilities/functions';
import { Message } from '@prisma/client';

const ModelStaticTextMessageCard = ({ message }: { message: Message }) => {
	return (
		<div className='flex flex-col space-y-2'>
			<div
				key={message.id}
				className='bg-foreground rounded-2xl ml-0 mr-auto w-5/12'
			>
				<div className='cursor-pointer p-4'>
					<p className='text-lg text-background tracking-tight leading-none text-ellipsis text-justify'>
						{message.content}
					</p>
				</div>
			</div>
			<p className='text-xs text-foreground tracking-tight leading-none text-ellipsis text-balance text-left'>
				{convertTo24HourTimeFormat(message.createdAt.toString())}
			</p>
		</div>
	);
};

export default ModelStaticTextMessageCard;
