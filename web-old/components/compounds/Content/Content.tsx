'use client';

import {
	ReactNode,
	useState,
} from '.pnpm/@types+react@18.3.12/node_modules/@types/react';
import Splash from '@/components/compounds/Splash/Splash';

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
