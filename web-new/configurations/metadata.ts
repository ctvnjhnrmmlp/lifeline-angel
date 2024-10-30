import { Metadata } from 'next';
import VARIABLES from './variables';

const METADATA: Metadata = {
	metadataBase: new URL(VARIABLES.canonical),
	title: VARIABLES.name,
	description: VARIABLES.info,
	applicationName: VARIABLES.nameConfig,
	generator: VARIABLES.stacks,
	keywords: VARIABLES.words,
	referrer: 'origin',
	themeColor: VARIABLES.theme,
	colorScheme: `dark`,
	creator: VARIABLES.developers,
	publisher: VARIABLES.developers,
	robots: VARIABLES.robots,
	alternates: {
		canonical: VARIABLES.canonical,
	},
	icons: `/images/${VARIABLES.icon}`,
	openGraph: {
		type: 'website',
		url: VARIABLES.canonical,
		title: VARIABLES.name,
		description: VARIABLES.info,
		siteName: VARIABLES.nameConfig,
		images: [
			{
				url: `/images/${VARIABLES.image}`,
			},
		],
	},
	twitter: {
		site: VARIABLES.nameConfig,
		creator: VARIABLES.developers,
		description: VARIABLES.info,
		title: VARIABLES.name,
		images: [
			{
				url: `/images/${VARIABLES.image}`,
			},
		],
	},
	appleWebApp: {
		capable: true,
		title: VARIABLES.developers,
		statusBarStyle: 'black-translucent',
	},
	formatDetection: {
		telephone: false,
	},
	abstract: VARIABLES.info,
	category: VARIABLES.words,
	classification: VARIABLES.info,
};

export default METADATA;
