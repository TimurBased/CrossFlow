import { createSlice } from '@reduxjs/toolkit'
import { login, register, logout } from './thunks'

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
