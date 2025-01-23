import { combineReducers } from 'redux'
import userSlice from '../features/authSlice'

export const rootReducer = combineReducers({
	userSlice,
})
