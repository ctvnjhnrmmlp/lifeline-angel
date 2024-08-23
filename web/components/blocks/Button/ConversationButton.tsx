'use client';

import { getTimeDifference } from '@/utilities/functions';
import { Conversation } from '@prisma/client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

const ConversationButton = ({ conv }: { conv: Conversation }) => {
	const pathname = usePathname();

	return (
		<div
			key={conv.id}
			className='backdrop-blur-2xl bg-foreground/1 rounded-2xl shadow-2xl'
			style={{
				background: pathname.includes(conv.id) ? '#27272A' : '',
			}}
		>
			<Link href={`/conversation/${conv.id}`}>
				<div className='flex items-center justify-between rounded-2xl cursor-pointer px-4 py-6'>
					<div>
						<p
							className='font-extrabold w-full text-xl text-foreground tracking-tight leading-none text-balance'
							style={{
								color: pathname.includes(conv.id) ? '#FFFFFF' : '',
							}}
						>
							{conv.title ? conv.title : 'New conversation'}
						</p>
					</div>
					<div>
						<p
							className='font-light w-full text-sm text-zinc-700 tracking-tight leading-none text-ellipsis text-balance'
							style={{
								color: pathname.includes(conv.id) ? '#FFFFFF' : '',
							}}
						>
							{getTimeDifference(conv.createdAt.toString())}
						</p>
					</div>
				</div>
			</Link>
		</div>
	);
};

export default ConversationButton;
