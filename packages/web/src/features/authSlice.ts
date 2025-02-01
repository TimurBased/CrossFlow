import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import AuthService from '../services/auth-service'
import { IUser } from '../types/IUser'
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

export interface User {
	userData: any
	isLoading: boolean
	error: string | null
	isLoggedIn: boolean
}

const initialState: User = {
	userData: null,
	isLoading: false,
	error: null,
	isLoggedIn: false,
}

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(login.fulfilled, (state, action) => {
				console.log('Login успешно выполнен!', action.payload)
				state.isLoading = false
				state.isLoggedIn = true
				state.userData = action.payload.userData
			})
			.addCase(login.rejected, (state, action) => {
				state.isLoading = false
				state.error = action.payload as string
			})
			.addCase(register.pending, state => {
				state.isLoading = true
				state.error = null
			})
			.addCase(register.fulfilled, (state, action) => {
				state.isLoading = false
				state.isLoggedIn = true
				state.userData = action.payload.userData
			})
			.addCase(register.rejected, (state, action) => {
				state.isLoading = false
				state.error = action.payload as string
			})
			.addCase(logout.pending, state => {
				state.isLoading = true
				state.error = null
			})
			.addCase(logout.fulfilled, state => {
				state.isLoading = false
				state.isLoggedIn = false
				state.userData = null
			})
			.addCase(logout.rejected, (state, action) => {
				state.isLoading = false
				state.error = action.payload as string
			})
	},
})

export default authSlice.reducer
