export const checkTextValidURL = (text: string) => {
	let url;

	try {
		url = new URL(text);
	} catch (e) {
		return false;
	}

	return url.protocol === 'http:' || url.protocol === 'https:';
};

export const getTimeDifference = (timestamp: string) => {
	const now = new Date();
	const time = new Date(timestamp);

	const secondsAgo = Math.floor((now - time) / 1000);
	const minutesAgo = Math.floor(secondsAgo / 60);
	const hoursAgo = Math.floor(minutesAgo / 60);
	const daysAgo = Math.floor(hoursAgo / 24);
	const weeksAgo = Math.floor(daysAgo / 7);
	const monthsAgo = Math.floor(daysAgo / 30);
	const yearsAgo = Math.floor(daysAgo / 365);

	if (minutesAgo < 60) return `${minutesAgo}m`;
	if (hoursAgo < 24) return `${hoursAgo}h`;
	if (daysAgo < 7) return `${daysAgo}d`;
	if (weeksAgo < 4) return `${weeksAgo}w`;
	if (monthsAgo < 12) return `${monthsAgo}mo`;

	return `${yearsAgo}y`;
};

export const checkMessageSecondsAgo = (timestamp: string) => {
	const now = new Date();
	const then = new Date(timestamp);
	const diffInSeconds = Math.floor((now - then) / 1000);

	const seconds = diffInSeconds;

	if (seconds <= 10) return true;

	return false;
};
