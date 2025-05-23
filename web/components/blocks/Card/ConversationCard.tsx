'use client';

import { SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import {
	checkEntitySecondsAgo,
	getTimeDifference,
} from '@/utilities/functions';
import { Conversation } from '@prisma/client';
import { SquareTerminal } from 'lucide-react';
import Link from 'next/link';
import { GoDotFill } from 'react-icons/go';
import { TypeAnimation } from 'react-type-animation';

const ConversationCard = ({ conv }: { conv: Conversation }) => {
	return (
		<Link href={`/conversation/${conv.id}`}>
			<SidebarMenuItem
				key={conv.id}
				className='p-1 outline outline-1 outline-zinc-200 dark:outline-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl'
			>
				<SidebarMenuButton tooltip={conv.title} className='mx-auto'>
					<SquareTerminal className='text-foreground' />
					<div className='flex justify-between w-full'>
						{checkEntitySecondsAgo(conv.createdAt.toString()) && (
							<div>
								<p className='font-extrabold w-full text-md text-foreground tracking-tight leading-none text-balance truncate'>
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
								<p className='font-extrabold w-full text-md text-foreground tracking-tight leading-none text-balance truncate'>
									{conv.title ? conv.title : 'New conversation'}
								</p>
							</div>
						)}
						<div className='flex items-center space-x-1'>
							<p className='text-zinc-700 text-xs'>
								<GoDotFill />
							</p>
							<p className='font-light w-full text-xs text-zinc-700 tracking-tight leading-none text-ellipsis text-balance'>
								{getTimeDifference(conv.createdAt.toString())}
							</p>
						</div>
					</div>
				</SidebarMenuButton>
			</SidebarMenuItem>
		</Link>
	);
};

export default ConversationCard;
