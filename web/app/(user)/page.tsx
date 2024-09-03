'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

export default function Page() {
	const { data: session } = useSession();

	if (!session) {
		return redirect('/signin');
	}

	return (
		<main className='flex flex-col justify-center pl-[26rem] py-4 pr-4 h-screen w-screen'>
			<section className='overflow-y-scroll no-scrollbar backdrop-blur-2xl bg-foreground/5 rounded-3xl h-screen'>
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
