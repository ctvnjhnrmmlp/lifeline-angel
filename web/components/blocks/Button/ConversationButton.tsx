'use client';

import {
	checkEntitySecondsAgo,
	getTimeDifference,
} from '@/utilities/functions';
import { Conversation } from '@prisma/client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GoDotFill } from 'react-icons/go';
import { TypeAnimation } from 'react-type-animation';

const ConversationButton = ({ conv }: { conv: Conversation }) => {
	const pathname = usePathname();

	return (
		<div
			key={conv.id}
			className='bg-background border-white/20 border-1 rounded-xl hover:bg-zinc-800 transition duration-100 ease-linear'
			style={{
				background: pathname.includes(conv.id) ? '#FFFFFF' : '',
				color: pathname.includes(conv.id) ? '#000000' : '',
			}}
		>
			<Link href={`/conversation/${conv.id}`}>
				<div className='flex items-center justify-between rounded-2xl cursor-pointer px-4 py-5'>
					{checkEntitySecondsAgo(conv.createdAt.toString()) && (
						<div>
							<p
								className='font-extrabold w-full text-xl text-foreground tracking-tight leading-none text-balance'
								style={{
									color: pathname.includes(conv.id) ? '#FFFFFF' : '',
								}}
							>
								<TypeAnimation
									sequence={[conv.title ? conv.title : 'New conversation']}
									cursor={false}
									speed={75}
								/>
							</p>
						</div>
					)}
					{!checkEntitySecondsAgo(conv.createdAt.toString()) && (
						<div>
							<p
								className='font-extrabold w-full text-xl text-foreground tracking-tight leading-none text-balance'
								style={{
									color: pathname.includes(conv.id) ? '#000000' : '',
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
								color: pathname.includes(conv.id) ? '#000000' : '',
							}}
						>
							<GoDotFill />
						</p>
						<p
							className='font-light w-full text-sm text-zinc-700 tracking-tight leading-none text-ellipsis text-balance'
							style={{
								color: pathname.includes(conv.id) ? '#000000' : '',
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
