import axios from 'axios'

export const api = axios.create({
	baseURL: 'http://localhost:5000',
	headers: {
		'Content-Type': 'application/json',
	},
})

api.interceptors.request.use(config => {
	const token = localStorage.getItem('refresh_token')
	if (token) {
		config.headers.Authorization = `Bearer ${token}`
	}
	return config
})
