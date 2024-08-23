'use client';

import {
	checkEntitySecondsAgo,
	getTimeDifference,
} from '@/utilities/functions';
import { Conversation } from '@prisma/client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { GoDotFill } from 'react-icons/go';
import { TypeAnimation } from 'react-type-animation';

const ConversationButton = ({ conv }: { conv: Conversation }) => {
	const pathname = usePathname();

	return (
		<div
			key={conv.id}
			className='backdrop-blur-2xl bg-foreground/1 rounded-2xl shadow-2xl hover:bg-zinc-800 transition duration-100 ease-linear'
			style={{
				background: pathname.includes(conv.id) ? '#27272A' : '',
			}}
		>
			<Link href={`/conversation/${conv.id}`}>
				<div className='flex items-center justify-between rounded-2xl cursor-pointer px-4 py-6'>
					{checkEntitySecondsAgo(conv.createdAt.toString()) && (
						<div>
							<p
								className='font-extrabold w-full text-xl text-foreground tracking-tight leading-none text-balance'
								style={{
									color: pathname.includes(conv.id) ? '#FFFFFF' : '',
								}}
							>
								<TypeAnimation
									sequence={[
										conv.title ? conv.title : 'New conversation',
										3000,
									]}
									wrapper='span'
									cursor={false}
								/>
							</p>
						</div>
					)}
					{!checkEntitySecondsAgo(conv.createdAt.toString()) && (
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
					)}
					<div className='flex items-center space-x-1'>
						<p
							className='text-zinc-700 text-xs'
							style={{
								color: pathname.includes(conv.id) ? '#FFFFFF' : '',
							}}
						>
							<GoDotFill />
						</p>
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
