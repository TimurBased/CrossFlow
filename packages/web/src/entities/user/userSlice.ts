import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import UserService from './services/user-service'
import { IUser } from '../../shared/types/IUser'

export const fetchUsers = createAsyncThunk(
	'/user',
	async (_, { rejectWithValue }) => {
		try {
			const response = await UserService.fetchAllUser()
			return response
		} catch (error: any) {
			return rejectWithValue(error.response.data)
		}
	}
)
export interface UserState {
	userList: IUser[]
	isLoading: boolean
	error: string | null
}

const initialState: UserState = {
	userList: [],
	isLoading: false,
	error: null,
}

const userSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(fetchUsers.fulfilled, (state, action) => {
				state.isLoading = false
				state.userList = action.payload
			})
			.addCase(fetchUsers.rejected, (state, action) => {
				state.isLoading = false
				state.error = action.payload as string
			})
			.addCase(fetchUsers.pending, state => {
				state.isLoading = true
				state.error = null
			})
	},
})

export default userSlice.reducer
