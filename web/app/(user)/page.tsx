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
					{/* Messages */}
					<div className='flex-grow w-full flex flex-col justify-center items-center'>
						<div className='flex flex-col gap-4'>
							<div>
								<p className='text-4xl font-bold'>Waddup Cuh</p>
							</div>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}
