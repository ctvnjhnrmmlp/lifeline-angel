import { Inter } from 'next/font/google';

const alphaFont = Inter({
	subsets: ['latin'],
	weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

const FONTS = {
	alpha: alphaFont,
};

export default FONTS;
