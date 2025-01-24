import { api } from './axios'
import { AuthResponse } from '../types/AuthResponse'
import { LoginFormValues } from '../types/LoginFormValues'

export const login = async (data: LoginFormValues) => {
	const response = await api.post<AuthResponse>('/auth/login', {
		email: data.email,
		password: data.password,
	})
	return response.data
}

export const registration = async (data: LoginFormValues) => {
	const response = await api.post<AuthResponse>('/auth/registration', {
		email: data.email,
		password: data.password,
	})
	return response.data
}

export const logout = async () => {
	const response = await api.post('/auth/logout')
	return response.data
}
