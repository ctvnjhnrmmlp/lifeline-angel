import { nextui } from '@nextui-org/react';
import type { Config } from 'tailwindcss';
import { withUt } from 'uploadthing/tw';
import COLORS from './configurations/colors';

const config: Config = withUt({
	content: [
		'./(app|components)/**/*.{js,ts,jsx,tsx,mdx}',
		'./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
	],
	darkMode: 'class',
	theme: {
		extend: {
			backgroundImage: {
				'lifeline-angel-cover': "url('/images/self-abstract.webp')",
			},
		},
	},
	plugins: [
		nextui({
			defaultTheme: 'dark',
			themes: {
				light: {},
				dark: {},
				lifelineAngelDark: {
					extend: 'dark',
					colors: {
						background: COLORS.alpha,
						foreground: COLORS.bravo,
						default: COLORS.bravo,
					},
				},
			},
		}),
	],
});

export default config;
