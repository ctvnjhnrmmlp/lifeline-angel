'use client';

import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import STRATEGIES from '@/sources/strategies';
import { signIn, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { useState } from 'react';
import { IoPerson } from 'react-icons/io5';

export default function Page() {
	const { data: session } = useSession();
	const [strategy, setStrategy] = useState('');

	const handleAgree = (strategy: string) => {
		setStrategy(strategy);
	};

	if (session) {
		return redirect('/');
	}

	return (
		<main className='flex flex-col justify-center p-6 h-screen w-screen'>
			<section className='h-full'>
				<div className='flex justify-center items-center space-x-4 h-full'>
					<Image
						src='/images/self-abstract.webp'
						height={100}
						width={100}
						alt='Lifeline Angel cover'
						className='h-full w-6/12 rounded-lg hidden lg:block'
						unoptimized
					/>
					<div className='p-28 rounded-3xl outline outline-1 h-full'>
						<div className='flex flex-col justify-center items-center space-y-12 h-full'>
							<div>
								<h1 className='text-foreground text-center font-extrabold text-7xl leading-none tracking-tight uppercase'>
									Sign In
								</h1>
							</div>
							<Dialog>
								<DialogTrigger asChild>
									<div className='flex flex-col space-y-6'>
										{STRATEGIES.map((strategy) => (
											<button
												key={strategy.name}
												className='py-2 px-6 sm:p-4 md:px-20 md:py-8 text-2xl sm:text-3xl md:text-5xl rounded-3xl text-center sm:flex-grow backdrop-blur-sm bg-foreground border-background/20 '
												onClick={() =>
													handleAgree(strategy.name.toLocaleLowerCase())
												}
											>
												<div>
													<strategy.icon className='text-background absolute left-12' />
													<h4 className='font-extrabold text-background leading-none tracking-tight uppercase mx-auto pl-28'>
														{strategy.name}
													</h4>
												</div>
											</button>
										))}
										<button className='py-2 px-6 sm:p-4 md:px-20 md:py-8 text-2xl sm:text-3xl md:text-5xl rounded-3xl text-center sm:flex-grow backdrop-blur-sm bg-background outline outline-1'>
											<div className='text-foreground'>
												<IoPerson className='absolute left-12' />
												<h4 className='font-extrabold leading-none tracking-tight uppercase mx-auto pl-28'>
													Guest
												</h4>
											</div>
										</button>
									</div>
								</DialogTrigger>
								<DialogContent className='sm:max-w-[70rem] sm:max-h-[50rem]'>
									<DialogHeader>
										<DialogTitle className='text-3xl font-bold text-center'>
											Collecting Personal Information
										</DialogTitle>
										<DialogDescription asChild>
											<div className='flex flex-col space-y-5 justify-center py-2'>
												<div>
													<p className='text-lg'>Dear User,</p>
												</div>
												<div>
													<p className='text-lg text-balance'>
														Welcome to Lifeline Angel! To provide you with
														accurate and personalized first aid recommendations
														based on your{' '}
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
														By using our service, you consent to our collection,
														storage, and processing of this personal data in
														accordance with our Privacy Policy. The information
														you provide will be used solely for delivering
														tailored first aid recommendations, improving our
														services, and ensuring the accuracy and relevance of
														our responses.
													</p>
												</div>
												<div>
													<p className='text-lg text-balance'>
														We take your privacy seriously and adhere to the
														highest standards of data protection, in compliance
														with relevant laws, including the{' '}
														<span className='font-bold'>
															Data Privacy Act of 2012
														</span>{' '}
														in the Philippines.
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
										</DialogDescription>
									</DialogHeader>
									<DialogFooter>
										<DialogClose asChild>
											<button className='px-5 py-3 bg-background border-white/20 border-1 text-foreground rounded-xl text-2xl font-bold tracking-tight outline outline-1'>
												Disagree
											</button>
										</DialogClose>
										<button
											className='px-5 py-3 bg-foreground text-background border-foreground/20 border-1 rounded-xl text-2xl font-bold tracking-tight'
											onClick={() => signIn(strategy)}
										>
											Agree
										</button>
									</DialogFooter>
								</DialogContent>
							</Dialog>
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
					</div>
				</div>
			</section>
		</main>
	);
}
