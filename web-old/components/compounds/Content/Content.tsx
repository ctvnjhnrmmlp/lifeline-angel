'use client';

import Splash from '@/components/compounds/Splash/Splash';
import { ReactNode, useState } from 'react';

function Content({ children }: { children: ReactNode }) {
	const [loading, setLoading] = useState(true);

	return (
		<>
			{loading && <Splash finishLoading={() => setLoading(false)} />}
			{!loading && <>{children}</>}
		</>
	);
}

export default Content;
