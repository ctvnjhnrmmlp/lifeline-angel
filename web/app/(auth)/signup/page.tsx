'use client';

import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { FaFacebookF, FaGoogle, FaInstagram } from 'react-icons/fa';

export default function Page() {
	const STRATEGIES = [
		{
			name: 'Google',
			icon: FaGoogle,
		},
		{
			name: 'Facebook',
			icon: FaFacebookF,
		},
		{
			name: 'Instagram',
			icon: FaInstagram,
		},
	];

	return (
		<main className='flex flex-col justify-center p-6 h-screen w-screen'>
			<section className='flex items-center overflow-y-scroll no-scrollbar backdrop-blur-2xl bg-foreground/5 rounded-3xl h-screen'>
				<div className='w-full flex flex-col flex-wrap justify-between space-between px-4 py-12 gap-12'>
					<div className='flex flex-col justify-center items-center space-y-12'>
						<div>
							<h1 className='text-foreground text-center font-extrabold text-8xl leading-none tracking-tight uppercase'>
								Sign Up
							</h1>
						</div>
						<div className='flex flex-col space-y-4'>
							{STRATEGIES.map((strategy) => (
								<button
									key={strategy.name}
									className='py-2 px-6 sm:p-4 md:px-12 md:py-10 text-2xl sm:text-3xl md:text-5xl lg:text-6xl rounded-full text-center sm:flex-grow backdrop-blur-sm bg-background/5'
									onClick={() => signIn(strategy.name.toLocaleLowerCase())}
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
								Already have an account?{' '}
								<Link className='font-bold' href='/signin'>
									{' '}
									Sign in
								</Link>
							</p>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}
