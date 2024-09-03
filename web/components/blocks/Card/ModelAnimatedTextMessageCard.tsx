'use client';

import { convertDateTo24HourTimeFormat } from '@/utilities/functions';
import { Message } from '@prisma/client';

const ModelAnimatedTextMessageCard = ({ message }: { message: Message }) => {
	const formattedMessages = message.content
		.split('.')
		.map((point) => point.trim())
		.filter((point) => point.length > 0);

	return (
		<div className='flex flex-col space-y-2'>
			<div
				key={message.id}
				className='bg-foreground rounded-2xl ml-0 mr-auto w-5/12'
			>
				<div className='cursor-pointer p-4'>
					<ul>
						{formattedMessages.map((message) => (
							<li
								key={message}
								className='text-lg text-background tracking-tight text-ellipsis'
							>
								{message}
							</li>
						))}
					</ul>
				</div>
			</div>
			<p className='text-xs text-foreground tracking-tight leading-none text-ellipsis text-balance text-left'>
				{convertDateTo24HourTimeFormat(message.createdAt.toString())}
			</p>
		</div>
	);
};

export default ModelAnimatedTextMessageCard;
