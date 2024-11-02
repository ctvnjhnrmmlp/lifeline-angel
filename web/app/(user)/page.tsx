'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

export default function Page() {
	const { data: session } = useSession();

	if (!session) {
		return redirect('/signin');
	}

	return (
		<main>
			<section className='relative rounded-3xl h-screen'>
				<SidebarTrigger
					variant='outline'
					className='absolute sm:invisible top-2 left-2 text-foreground p-5 rounded-xl'
				/>

				<div className='flex flex-col justify-center items-center h-full p-6'>
					<div>
						<h1 className='text-5xl font-bold text-center'>Lifeline Angel</h1>
					</div>
				</div>
			</section>
		</main>
	);
}
