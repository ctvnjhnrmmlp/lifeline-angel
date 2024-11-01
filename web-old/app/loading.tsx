'use client';

import Splash from '@/components/compounds/Splash/Splash';
import { useState } from 'react';

function Loading() {
	const [loading, setLoading] = useState(true);

	return (
		<section className='flex flex-col gap-6 px-4 bg-background'>
			{loading && <Splash finishLoading={() => setLoading(false)} />}
		</section>
	);
}

export default Loading;
