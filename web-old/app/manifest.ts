import VARIABLES from '@/configurations/variables';
import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: VARIABLES.name,
		short_name: VARIABLES.nameConfig,
		description: VARIABLES.info,
		start_url: '/',
		display: 'standalone',
		background_color: VARIABLES.theme,
		theme_color: VARIABLES.theme,
		icons: [
			{
				src: '/images/lifeline-angel.png',
				sizes: '192x192',
				type: 'image/png',
			},
			{
				src: '/images/lifeline-angel.png',
				sizes: '512x512',
				type: 'image/png',
			},
		],
	};
}
