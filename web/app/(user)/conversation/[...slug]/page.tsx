'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { BsGrid1X2Fill } from 'react-icons/bs';
import { FaCamera } from 'react-icons/fa';
import { v4 as uuidv4 } from 'uuid';

import { Link, ScrollShadow } from '@nextui-org/react';
import { FaLocationArrow, FaMicrophone } from 'react-icons/fa';

export default function Page({ params }: { params: { slug: string[] } }) {
	const { data: session } = useSession();

	const test = [
		uuidv4(),
		uuidv4(),
		uuidv4(),
		uuidv4(),
		uuidv4(),
		uuidv4(),
		uuidv4(),
		uuidv4(),
		uuidv4(),
		uuidv4(),
		uuidv4(),
		uuidv4(),
		uuidv4(),
		uuidv4(),
		uuidv4(),
		uuidv4(),
		uuidv4(),
		uuidv4(),
		uuidv4(),
		uuidv4(),
		uuidv4(),
		uuidv4(),
	];

	// if (!session) {
	// 	return redirect('/signin');
	// }

	return (
		<main className='flex flex-col justify-center pl-[26rem] py-4 pr-4 h-screen w-screen'>
			<section className='overflow-y-scroll no-scrollbar backdrop-blur-2xl bg-foreground/5 rounded-2xl h-screen'>
				<div className='flex flex-col p-6 outline h-full'>
					{/* Mini Navbar */}
					<div className='w-full flex flex-col flex-wrap justify-between space-between gap-12'>
						<div className='flex items-center justify-between'>
							<div>
								<p className='font-bold text-4xl'>{params.slug[0]}</p>
							</div>
							<div className='flex space-x-2'>
								<button className='block rounded-full p-3 bg-foreground text-background text-2xl'>
									<FaCamera />
								</button>
								<button className='block rounded-full p-3 bg-foreground text-background text-2xl'>
									<BsGrid1X2Fill />
								</button>
							</div>
						</div>
					</div>
					{/* Messages */}
					<div className='overflow-y-scroll no-scrollbar h-screen my-4'>
						<ScrollShadow className='flex flex-col gap-2 overflow-y-scroll no-scrollbar py-4 h-screen'>
							{test.map((t) => (
								<div
									key={t}
									className='backdrop-blur-2xl bg-foreground/5 rounded-xl'
								>
									<div className='cursor-pointer p-6'>
										<p className='w-full text-lg text-foreground tracking-tight leading-none text-ellipsi text-balance'>
											{t}
										</p>
									</div>
								</div>
							))}
						</ScrollShadow>
					</div>
					{/* Message */}
					<div className='w-full flex justify-between space-x-3'>
						<div className='w-full'>
							<input
								type='text'
								placeholder='Aa'
								className='p-3 w-full rounded-xl placeholder:font-bold placeholder:text-foreground font-bold text-foreground text-2xl'
							/>
						</div>
						<div className='flex items-center justify-center space-x-2'>
							<button className='block rounded-full bg-foreground text-background text-2xl p-4'>
								<FaMicrophone />
							</button>
							<button className='block rounded-full bg-foreground text-background text-2xl p-4'>
								<FaLocationArrow />
							</button>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}
