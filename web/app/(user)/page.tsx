'use client';

import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	useDisclosure,
} from '@nextui-org/react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { BsGrid1X2Fill } from 'react-icons/bs';
import { FaCamera, FaLocationArrow, FaMicrophone } from 'react-icons/fa';

export default function Page() {
	const { data: session } = useSession();

	if (!session) {
		return redirect('/signin');
	}

	return (
		<main className='flex flex-col justify-center pl-[26rem] py-4 pr-4 h-screen w-screen'>
			<section className='overflow-y-scroll no-scrollbar backdrop-blur-2xl bg-foreground/5 rounded-2xl h-screen'>
				<div className='flex flex-col p-6 outline h-full'>
					{/* Mini Navbar */}
					<div className='w-full flex flex-col flex-wrap justify-between space-between gap-12'>
						<div className='flex items-center justify-between'>
							<div>
								<p className='font-bold text-4xl'>New message</p>
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
					<div className='flex-grow w-full flex flex-col justify-center items-center'>
						<div className='flex flex-col gap-4'>
							<div>
								<p className='text-3xl font-bold'>Waddup cuh</p>
							</div>
						</div>
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
						<div className='flex space-x-2'>
							<button className='block rounded-full bg-foreground text-background text-2xl p-4'>
								<FaMicrophone />
							</button>
							<button className='block rounded-full bg-foreground text-background text-2xl p-4'>
								<FaLocationArrow />
							</button>
						</div>
					</div>{' '}
				</div>
			</section>
		</main>
	);
}
