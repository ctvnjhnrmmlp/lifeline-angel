'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

export default function Page() {
	const { data: session } = useSession();

	// if (!session) {
	// 	return redirect('/signin');
	// }

	return (
		<main className='flex flex-col justify-center pl-[26rem] py-4 pr-4 h-screen w-screen'>
			<section className='overflow-y-scroll no-scrollbar backdrop-blur-2xl bg-foreground/5 rounded-2xl h-screen'>
				<div className='outline'>
					{/* Mini Navbar */}
					<div className='w-full flex flex-col flex-wrap justify-between space-between px-4 py-6 gap-12 outline'>
						<div className='flex flex-col gap-4'>
							<div className='rounded-xl'></div>
						</div>
					</div>
					{/* Messages */}
					<div className='w-full flex flex-col flex-wrap justify-between space-between px-4 py-6 gap-12 outline'>
						<div className='flex flex-col gap-4'>
							<div className='rounded-xl'></div>
						</div>
					</div>
					{/* Messages */}
					<div className='w-full flex flex-col flex-wrap justify-between space-between px-4 py-6 gap-12 outline'>
						<div className='flex flex-col gap-4'>
							<div className='rounded-xl'></div>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}
