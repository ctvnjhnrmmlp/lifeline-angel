import localFont from '.pnpm/next@15.0.2_react-dom@19.0.0-rc-02c0e824-20241028_react@19.0.0-rc-02c0e824-20241028__react@19.0.0-rc-02c0e824-20241028/node_modules/next/font/local';

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
