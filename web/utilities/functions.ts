export const checkTextValidURL = (text: string) => {
	let url;

	try {
		url = new URL(text);
	} catch (e) {
		return false;
	}

	return url.protocol === 'http:' || url.protocol === 'https:';
};
