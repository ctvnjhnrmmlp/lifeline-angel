'use client';

import { agree, getUser } from '@/services/lifeline-angel/user';
import { useUserStore } from '@/stores/lifeline-angel/user';
import {
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	useDisclosure,
} from '@nextui-org/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { signOut, useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function Page() {
	const { data: session } = useSession();
	const {
		user: userLocal,
		setUser: setUserLocal,
		setAgree: setAgreeLocal,
	} = useUserStore();

	const {
		isOpen: isOpenConsent,
		onOpen: onOpenConsent,
		onOpenChange: onOpenChangeConsent,
	} = useDisclosure();

	const agreeMutation = useMutation({
		mutationFn: async () => await agree(session?.user.email, session?.user.id),
	});

	const handleAgree = () => {
		onOpenConsent();
		setAgreeLocal();
		agreeMutation.mutate();
	};

	const { data: userServer, status: userServerStatus } = useQuery({
		queryKey: ['getUser'],
		refetchOnWindowFocus: false,
		queryFn: async () => await getUser(session?.user.email),
	});

	useEffect(() => {
		if (userServerStatus === 'success' && userServer && !userLocal) {
			setUserLocal(userServer);
		}
	}, [userServer]);

	useEffect(() => {
		if (!userLocal?.agreed) {
			onOpenConsent();
		}
	}, []);

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
						<div>
							<Modal
								size='5xl'
								backdrop='blur'
								isDismissable={false}
								isOpen={isOpenConsent}
								closeButton={<></>}
								classNames={{
									base: 'bg-background',
									header: 'flex justify-center items-center',
									body: 'flex gap-4',
									footer: 'py-4 space-x-0.5',
								}}
								onOpenChange={onOpenChangeConsent}
							>
								<ModalContent>
									{(onClose) => (
										<>
											<ModalHeader>
												<p className='text-2xl font-bold text-center'>
													Collecting Personal Information
												</p>
											</ModalHeader>
											<ModalBody>
												<div className='flex flex-col space-y-5 justify-center'>
													<div>
														<p className='text-lg'>Dear User,</p>
													</div>
													<div>
														<p className='text-lg text-balance'>
															Welcome to Lifeline Angel! To provide you with
															accurate and personalized first aid
															recommendations based on your{' '}
															<span className='font-bold'>
																input (textual or image)
															</span>
															, we need to collect certain personal information,
															including your{' '}
															<span className='font-bold'>
																name, email address, and any images or
																descriptions
															</span>{' '}
															of injuries you provide.
														</p>
													</div>
													<div>
														<p className='text-lg text-balance'>
															By using our service, you consent to our
															collection, storage, and processing of this
															personal data in accordance with our Privacy
															Policy. The information you provide will be used
															solely for delivering tailored first aid
															recommendations, improving our services, and
															ensuring the accuracy and relevance of our
															responses.
														</p>
													</div>
													<div>
														<p className='text-lg text-balance'>
															We take your privacy seriously and adhere to the
															highest standards of data protection, in
															compliance with relevant laws, including the{' '}
															<span className='font-bold'>
																Data Privacy Act of 2012
															</span>{' '}
															in the Philippines, the{' '}
															<span className='font-bold'>
																General Data Protection Regulation (GDPR)
															</span>{' '}
															for users in the European Union, and the
															<span className='font-bold'>
																{' '}
																California Consumer Privacy Act (CCPA)
															</span>{' '}
															for users in California.
														</p>
													</div>
													<div>
														<p className='text-lg text-balance'>
															You have the right to withdraw your consent at any
															time, request access to your data, or ask for its
															deletion by contacting us at{' '}
															<span className='font-bold'>
																lifelineangel.@gmail.com
															</span>
														</p>
													</div>
													<div>
														<p className='text-lg text-balance'>
															If you agree to these terms, please indicate your
															consent by clicking{' '}
															<span className='font-bold'>"Accept"</span> below.
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
													className='px-5 py-2 bg-foreground/60 text-background rounded-lg text-2xl font-bold tracking-tight'
													onClick={() => signOut()}
												>
													Disagree
												</button>
												<button
													className='px-5 py-2 bg-foreground text-background rounded-lg text-2xl font-bold tracking-tight'
													onClick={() => handleAgree()}
												>
													Agree
												</button>
											</ModalFooter>
										</>
									)}
								</ModalContent>
							</Modal>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}
