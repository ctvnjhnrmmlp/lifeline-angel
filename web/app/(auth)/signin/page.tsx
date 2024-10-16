'use client';

import STRATEGIES from '@/sources/strategies';
import {
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	useDisclosure,
} from '@nextui-org/react';
import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { useState } from 'react';

export default function Page() {
	const { data: session } = useSession();
	const [strategy, setStrategy] = useState('');

	const {
		isOpen: isOpenConsent,
		onOpen: onOpenConsent,
		onOpenChange: onOpenChangeConsent,
		onClose: onCloseConsent,
	} = useDisclosure();

	const handleAgree = (strategy: string) => {
		setStrategy(strategy);
		onOpenConsent();
	};

	if (session) {
		return redirect('/');
	}

	return (
		<main className='flex flex-col justify-center p-6 h-screen w-screen'>
			<section className='flex items-center overflow-y-scroll no-scrollbar backdrop-blur-sm bg-white/5 border-white/20 border-1 rounded-3xl h-screen'>
				<div className='h-full w-full bg-lifeline-angel-cover bg-cover bg-no-repeat' />
				<div className='p-12'>
					<div className='flex flex-col justify-center items-center space-y-12'>
						<div>
							<h1 className='text-foreground text-center font-extrabold text-8xl leading-none tracking-tight uppercase'>
								Sign In
							</h1>
						</div>
						<div className='flex flex-col space-y-4'>
							{STRATEGIES.map((strategy) => (
								<button
									key={strategy.name}
									className='py-2 px-6 sm:p-4 md:px-20 md:py-10 text-2xl sm:text-3xl md:text-5xl lg:text-6xl rounded-full text-center sm:flex-grow backdrop-blur-sm bg-background/5 border-white/20 border-1'
									onClick={() => handleAgree(strategy.name.toLocaleLowerCase())}
								>
									<div>
										<strategy.icon className='absolute left-12' />
										<h4 className='font-extrabold leading-none tracking-tight uppercase mx-auto pl-28'>
											{strategy.name}
										</h4>
									</div>
								</button>
							))}
						</div>
						<div>
							<p className='text-2xl font-light'>
								{`Don't have an account?`}{' '}
								<Link className='font-bold' href='/signup'>
									{' '}
									Sign up
								</Link>
							</p>
						</div>
					</div>
					<div>
						<Modal
							size='5xl'
							backdrop='blur'
							isOpen={isOpenConsent}
							closeButton={<></>}
							classNames={{
								base: 'backdrop-blur-sm bg-background/90 border-white/20 border-1 p-4',
								header: 'flex justify-center items-center',
								body: 'flex gap-4',
								footer: 'py-4 space-x-0.5',
							}}
							onOpenChange={onOpenChangeConsent}
						>
							<ModalContent>
								<ModalHeader>
									<h1 className='text-3xl font-bold text-center'>
										Collecting Personal Information
									</h1>
								</ModalHeader>
								<ModalBody>
									<div className='flex flex-col space-y-5 justify-center'>
										<div>
											<p className='text-lg'>Dear User,</p>
										</div>
										<div>
											<p className='text-lg text-balance'>
												Welcome to Lifeline Angel! To provide you with accurate
												and personalized first aid recommendations based on your{' '}
												<span className='font-bold'>
													input (textual or image)
												</span>
												, we need to collect certain personal information,
												including your{' '}
												<span className='font-bold'>
													name, email address, and any images or descriptions
												</span>{' '}
												of injuries you provide.
											</p>
										</div>
										<div>
											<p className='text-lg text-balance'>
												By using our service, you consent to our collection,
												storage, and processing of this personal data in
												accordance with our Privacy Policy. The information you
												provide will be used solely for delivering tailored
												first aid recommendations, improving our services, and
												ensuring the accuracy and relevance of our responses.
											</p>
										</div>
										<div>
											<p className='text-lg text-balance'>
												We take your privacy seriously and adhere to the highest
												standards of data protection, in compliance with
												relevant laws, including the{' '}
												<span className='font-bold'>
													Data Privacy Act of 2012
												</span>{' '}
												in the Philippines.
											</p>
										</div>
										<div>
											<p className='text-lg text-balance'>
												You have the right to withdraw your consent at any time,
												request access to your data, or ask for its deletion by
												contacting us at{' '}
												<span className='font-bold'>
													lifelineangel.@gmail.com
												</span>
											</p>
										</div>
										<div>
											<p className='text-lg text-balance'>
												If you agree to these terms, please indicate your
												consent by clicking{' '}
												<span className='font-bold'>Accept</span> below.
											</p>
										</div>
										<div>
											<p className='text-lg text-balance'>
												Thank you for your trust!
											</p>
										</div>
										<div>
											<p className='text-xl font-bold text-balance'>
												The Lifeline Angel Team
											</p>
										</div>
									</div>
								</ModalBody>
								<ModalFooter>
									<button
										className='px-5 py-2 backdrop-blur-sm bg-background/5 border-white/20 border-1 text-foreground rounded-full text-2xl font-bold tracking-tight'
										onClick={() => onCloseConsent()}
									>
										Disagree
									</button>
									<button
										className='px-5 py-2 backdrop-blur-sm bg-foreground/5 border-foreground/20 border-1 text-foreground rounded-full text-2xl font-bold tracking-tight'
										onClick={() => signIn(strategy)}
									>
										Agree
									</button>
								</ModalFooter>
							</ModalContent>
						</Modal>
					</div>
				</div>
			</section>
		</main>
	);
}
