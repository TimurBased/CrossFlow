import axios from 'axios'

const API_URL = 'http://localhost:5000'

export const api = axios.create({
	baseURL: API_URL,
	withCredentials: true,
	headers: {
		'Content-Type': 'application/json',
	},
})

api.interceptors.request.use(config => {
	const token = config.headers.Authorization
	if (token) {
		config.headers.Authorization = `Bearer ${token}`
	}
	return config
})

api.interceptors.response.use(
	response => response,
	async error => {
		const originalRequest = error.config
		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true

			try {
				await axios.post(
					`${API_URL}/auth/refresh`,
					{},
					{ withCredentials: true }
				)

				return api(originalRequest)
			} catch (err) {
				window.location.href = '/login'
			}
		}

		return Promise.reject(error)
	}
)
