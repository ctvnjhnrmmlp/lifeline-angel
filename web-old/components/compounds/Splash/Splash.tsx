'use client';

import {
	useEffect,
	useState,
} from '.pnpm/@types+react@18.3.12/node_modules/@types/react';
import Image from '.pnpm/next@15.0.2_react-dom@19.0.0-rc-02c0e824-20241028_react@19.0.0-rc-02c0e824-20241028__react@19.0.0-rc-02c0e824-20241028/node_modules/next/image';
import { Spinner } from '@nextui-org/react';
import anime from 'animejs';

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
