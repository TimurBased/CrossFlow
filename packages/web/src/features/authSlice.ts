import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { login, registration, logout } from '../api/authApi'
import { LoginFormValues } from '../types/LoginFormValues'

export const loginThunk = createAsyncThunk(
	'auth/login',
	async (data: LoginFormValues) => {
		const response = await login(data)
		return response
	}
)

export const registrationThunk = createAsyncThunk(
	'auth/registration',
	async (data: LoginFormValues) => {
		const response = await registration(data)
		return response
	}
)

export const logoutThunk = createAsyncThunk('auth/logout', async () => {
	const response = await logout()
	return response
})

export interface User {
	token: string | null
	userData: any
	isLoading: boolean
	error: string | null
}

const initialState: User = {
	token: localStorage.getItem('refresh_token') || null,
	userData: null,
	isLoading: false,
	error: null,
}

const userSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder.addCase(loginThunk.fulfilled, (state, action) => {
			state.token = action.payload.tokens.refreshToken
			state.userData = action.payload.userData
			state.isLoading = false
		})
		builder.addCase(loginThunk.pending, state => {
			state.isLoading = true
		})
		builder.addCase(loginThunk.rejected, state => {
			state.isLoading = false
			state.error = 'Login error'
		})
	},
})

export default userSlice.reducer
