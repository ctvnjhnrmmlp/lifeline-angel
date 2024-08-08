import axios from 'axios';

const client = axios.create({
	baseURL: process.env.NEXT_PUBLIC_LIFELINE_ANGEL_API_URL as string,
});

export default client;
