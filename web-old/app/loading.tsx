'use client';

import { useState } from '.pnpm/@types+react@18.3.12/node_modules/@types/react';
import Splash from '@/components/compounds/Splash/Splash';

function Loading() {
	const [loading, setLoading] = useState(true);

	return (
		<section className='flex flex-col gap-6 px-4 bg-background'>
			{loading && <Splash finishLoading={() => setLoading(false)} />}
		</section>
	);
}

export default Loading;
