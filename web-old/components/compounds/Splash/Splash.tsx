'use client';

import { Spinner } from '@nextui-org/react';
import anime from 'animejs';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const Splash = ({ finishLoading }: { finishLoading: () => void }) => {
	const [mounted, setMounted] = useState(false);

	const handleAnimate = () => {
		const loader = anime.timeline({
			complete: () => finishLoading(),
		});

		loader.add({
			targets: '#splash-container',
			delay: 0,
			scale: 1,
			duration: 5000,
			easing: 'easeInOutExpo',
		});
	};

	useEffect(() => {
		const timeout = setTimeout(() => setMounted(true), 1000);
		handleAnimate();
		return () => clearTimeout(timeout);
	});

	return (
		<div className='flex flex-col min-h-screen justify-center items-center duration-300 bg-background'>
			<div
				className='flex flex-col justify-center items-center space-y-10 p-8'
				id='splash-container'
			>
				<div className='flex flex-col justify-center items-center'>
					<Image
						src='/images/lifeline-angel.png'
						width={250}
						height={250}
						alt='Lifeline Angel logo'
					/>
				</div>
				<div>
					<Spinner color='default' size='lg' />
				</div>
			</div>
		</div>
	);
};

export default Splash;
