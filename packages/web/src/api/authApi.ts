import axios from 'axios'
import { AuthResponse } from '../types/AuthResponse'
import { LoginFormValues } from '../types/LoginFormValues'

export const login = async (data: LoginFormValues) => {
	const response = await axios.post<AuthResponse>('/auth/login', {
		data,
	})
	return response.data
}

export const registration = async (data: LoginFormValues) => {
	const response = await axios.post<AuthResponse>('/auth/registration', {
		email: data.email,
		password: data.password,
	})
	return response.data
}

export const logout = async () => {
	const response = await axios.post('/auth/logout')
	return response.data
}
