import type { MetadataRoute } from '.pnpm/next@15.0.2_react-dom@19.0.0-rc-02c0e824-20241028_react@19.0.0-rc-02c0e824-20241028__react@19.0.0-rc-02c0e824-20241028/node_modules/next';
import VARIABLES from '@/configurations/variables';

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
