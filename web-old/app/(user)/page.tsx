'use client';

import { useSession } from '.pnpm/next-auth@4.24.10_next@15.0.2_react-dom@19.0.0-rc-02c0e824-20241028_react@19.0.0-rc-02c0e824-_6v3ny5a5udmzoog3xss5rkgreu/node_modules/next-auth/react';
import { redirect } from '.pnpm/next@15.0.2_react-dom@19.0.0-rc-02c0e824-20241028_react@19.0.0-rc-02c0e824-20241028__react@19.0.0-rc-02c0e824-20241028/node_modules/next/navigation';
import { subscribeNotifications, unsubscribeNotifications } from '../actions';

export default function Page() {
	const { data: session } = useSession();

	if (!session) {
		return redirect('/signin');
	}

	return (
		<main className='flex flex-col justify-center pl-[26rem] py-4 pr-4 h-screen w-screen'>
			<section className='overflow-y-scroll no-scrollbar bg-background border-foreground/20 border-1 rounded-3xl h-screen'>
				<div className='flex flex-col p-6 outline h-full'>
					<div className='flex-grow w-full flex flex-col justify-center items-center'>
						<div className='flex flex-col space-y-2'>
							<div>
								<p className='text-4xl font-bold text-center'>
									Welcome to Lifeline Angel
								</p>
							</div>
							<div>
								<p className='text-xl font-extralight text-zinc-800 text-center'>
									Begin by adding a conversation to get started.
								</p>
							</div>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}
