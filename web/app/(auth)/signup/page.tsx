'use client';

import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import STRATEGIES from '@/sources/strategies';
import { signIn, useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useState } from 'react';

export default function Page() {
	const { data: session } = useSession();
	const [strategy, setStrategy] = useState('');

	if (session) {
		return redirect('/');
	}

	return (
		<div className='flex h-screen w-full items-center justify-center px-4'>
			<Card className='mx-auto max-w-sm'>
				<CardHeader>
					<CardTitle className='text-4xl'>Sign Up</CardTitle>
				</CardHeader>
				<CardContent>
					<Dialog>
						<DialogTrigger asChild>
							<div className='space-y-2'>
								{STRATEGIES.map((strategy) => (
									<Button
										key={strategy.name}
										className='w-full text-xl py-7'
										onClick={() => setStrategy(strategy.name)}
									>
										Continue with {strategy.provider}
									</Button>
								))}
								<Button
									className='w-full text-xl py-7'
									onClick={() => setStrategy('')}
								>
									Continue as Guest
								</Button>
							</div>
						</DialogTrigger>
						<DialogContent className='sm:max-w-[70rem] sm:max-h-[50rem] bg-foreground border-0'>
							<DialogHeader>
								<DialogTitle className='text-2xl md:text-3xl font-bold text-center text-background'>
									Collecting Personal Information
								</DialogTitle>
								<DialogDescription asChild>
									<ScrollArea className='h-[35rem] sm:h-full'>
										<div className='flex flex-col space-y-5 justify-center py-2'>
											<div>
												<p className='text-md md:text-lg text-background'>
													Dear User,
												</p>
											</div>
											<div>
												<p className='text-md md:text-lg text-balance text-background'>
													Welcome to Lifeline Angel! To provide you with
													accurate and personalized first aid recommendations
													based on your{' '}
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
												<p className='text-md md:text-lg text-balance text-background'>
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
												<p className='text-md md:text-lg text-balance text-background'>
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
												<p className='text-md md:text-lg text-balance text-background'>
													You have the right to withdraw your consent at any
													time, request access to your data, or ask for its
													deletion by contacting us at{' '}
													<span className='font-bold'>
														lifelineangel.@gmail.com
													</span>
												</p>
											</div>
											<div>
												<p className='text-md md:text-lg text-balance text-background'>
													If you agree to these terms, please indicate your
													consent by clicking{' '}
													<span className='font-bold'>Accept</span> below.
												</p>
											</div>
											<div>
												<p className='text-md md:text-lg text-balance text-background'>
													Thank you for your trust!
												</p>
											</div>
											<div>
												<p className='text-xl font-bold text-balance text-background'>
													The Lifeline Angel Team
												</p>
											</div>
										</div>
									</ScrollArea>
								</DialogDescription>
							</DialogHeader>
							<DialogFooter>
								<DialogClose asChild>
									<button className='px-5 py-3 bg-foreground text-background rounded-xl text-2xl font-bold tracking-tight outline outline-1 outline-zinc-800'>
										Disagree
									</button>
								</DialogClose>
								<button
									className='px-5 py-3 bg-background text-foreground rounded-xl text-2xl font-bold tracking-tight mb-2 sm:mb-0'
									onClick={() => {
										if (strategy) return signIn(strategy);

										redirect('/guest');
									}}
								>
									Agree
								</button>
							</DialogFooter>
						</DialogContent>
					</Dialog>
					<div className='mt-4 text-center text-sm'>
						Already have an account?{' '}
						<Link href='/signin' className='underline'>
							Sign in
						</Link>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
