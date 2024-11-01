import axios from 'axios';

const client = (url: string) => {
	return axios.create({
		baseURL: url,
	});
};

export default client;
