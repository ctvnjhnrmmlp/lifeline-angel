export const copy = async (text: string) => {
	await window.navigator.clipboard.writeText(text);
};

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

	// @ts-expect-error: must be corrected properly
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

export const checkEntitySecondsAgo = (timestamp: string) => {
	const now = new Date();
	const then = new Date(timestamp);
	// @ts-expect-error: must be corrected properly
	const diffInSeconds = Math.floor((now - then) / 1000);

	const seconds = diffInSeconds;

	if (seconds <= 10) return true;

	return false;
};

export const convertDateTo24HourTimeFormat = (timestamp: string) => {
	const date = new Date(timestamp);
	let hours = date.getHours();
	const minutes = date.getMinutes().toString().padStart(2, '0');
	// Convert hours from 24-hour format to 12-hour format
	const convertedHours = hours < 12 ? hours + 12 : hours;
	// Format the time as "20:58"
	const formattedTime = `${convertedHours}:${minutes}`;

	return formattedTime;
};

export const convertToDateFormat = (timestamp: string) => {
	const date = new Date(timestamp);

	const options = { day: 'numeric', month: 'long', year: 'numeric' };
	// @ts-expect-error: must be corrected properly
	const formattedDate = date.toLocaleDateString('en-GB', options);

	return formattedDate;
};

export const convertImageDataUrlToFile = (
	dataurl: string,
	filename: string
) => {
	let arr = dataurl.split(',');
	let mime = arr[0]!.match(/:(.*?);/)![1];
	let bstr = atob(arr[arr.length - 1]);
	let n = bstr.length;
	let u8arr = new Uint8Array(n);

	while (n--) {
		u8arr[n] = bstr.charCodeAt(n);
	}

	return new File([u8arr], filename, { type: mime });
};

export const convertBase64UrlToInt8Array = (url: string) => {
	const padding = '='.repeat((4 - (url.length % 4)) % 4);
	const base64 = (url + padding).replace(/\\-/g, '+').replace(/_/g, '/');
	const rawData = window.atob(base64);
	const outputArray = new Uint8Array(rawData.length);

	for (let i = 0; i < rawData.length; ++i) {
		outputArray[i] = rawData.charCodeAt(i);
	}

	return outputArray;
};
