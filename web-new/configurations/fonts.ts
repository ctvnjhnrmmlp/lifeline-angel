import localFont from 'next/font/local';

const geistSans = localFont({
	src: '../public/fonts/geist-vf.woff',
	variable: '--font-geist-sans',
	weight: '100 200 300 400 500 600 700 800 900',
});

const geistMono = localFont({
	src: '../public/fonts/geist-mono-vf.woff',
	variable: '--font-geist-mono',
	weight: '100 200 300 400 500 600 700 800 900',
});

const FONTS = {
	alpha: geistSans,
	bravo: geistMono,
};

export default FONTS;
