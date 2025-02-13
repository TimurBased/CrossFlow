import { api } from '../../../shared/api/axios'
import { AuthResponse } from '../types/AuthResponse'
import { IUser } from '../../../shared/types/IUser'

class AuthService {
	async login(data: IUser) {
		const response = await api.post<AuthResponse, any>('/auth/login', {
			email: data.email,
			password: data.password,
		})
		return response.data
	}

	async registration(data: IUser) {
		const response = await api.post<AuthResponse>('/auth/registration', {
			email: data.email,
			password: data.password,
		})
		return response.data
	}

	async logout() {
		const response = await api.post('/auth/logout')
		return response.data
	}
}

export default new AuthService()
