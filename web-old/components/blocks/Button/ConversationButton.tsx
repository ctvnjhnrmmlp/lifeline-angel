'use client';

import { Conversation } from '.pnpm/@prisma+client@5.21.1_prisma@5.21.1/node_modules/@prisma/client/default';
import Link from '.pnpm/next@15.0.2_react-dom@19.0.0-rc-02c0e824-20241028_react@19.0.0-rc-02c0e824-20241028__react@19.0.0-rc-02c0e824-20241028/node_modules/next/link';
import { usePathname } from '.pnpm/next@15.0.2_react-dom@19.0.0-rc-02c0e824-20241028_react@19.0.0-rc-02c0e824-20241028__react@19.0.0-rc-02c0e824-20241028/node_modules/next/navigation';
import { GoDotFill } from '.pnpm/react-icons@5.3.0_react@19.0.0-rc-02c0e824-20241028/node_modules/react-icons/go';
import { TypeAnimation } from '.pnpm/react-type-animation@3.2.0_prop-types@15.8.1_react-dom@19.0.0-rc-02c0e824-20241028_react@19.0_ynivbapjqqay2br4cyrkigyq3u/node_modules/react-type-animation/dist';
import {
	checkEntitySecondsAgo,
	getTimeDifference,
} from '@/utilities/functions';

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
