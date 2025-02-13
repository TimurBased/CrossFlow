import { createAsyncThunk } from '@reduxjs/toolkit'
import AuthService from '../services/auth-service'
import { IUser } from '../../../shared/types/IUser'
import { AuthResponse } from '../types/AuthResponse'

export const login = createAsyncThunk(
	'auth/login',
	async (data: IUser, { rejectWithValue }) => {
		try {
			const response: AuthResponse = await AuthService.login(data)
			return response
		} catch (error: any) {
			return rejectWithValue(error.response.data)
		}
	}
)

export const register = createAsyncThunk(
	'auth/registration',
	async (data: IUser, { rejectWithValue }) => {
		try {
			const response: AuthResponse = await AuthService.registration(data)
			return response
		} catch (error: any) {
			return rejectWithValue(error.response.data)
		}
	}
)

export const logout = createAsyncThunk(
	'auth/logout',
	async (_, { rejectWithValue }) => {
		try {
			const response = await AuthService.logout()
			localStorage.removeItem('accessToken')
			return response
		} catch (error: any) {
			return rejectWithValue(error.response.data)
		}
	}
)
