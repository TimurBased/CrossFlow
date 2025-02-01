import { combineReducers } from 'redux'
import authSlice from '../features/authSlice'
import userSlice from '../features/userSlice'

export const rootReducer = combineReducers({
	auth: authSlice,
	user: userSlice,
})
