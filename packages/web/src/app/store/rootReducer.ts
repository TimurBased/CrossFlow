import { combineReducers } from 'redux'
import authSlice from '../../features/auth/model/authSlice'
import userSlice from '../../entities/user/userSlice'
import boardSlice from '../../features/game/model/slice'

export const rootReducer = combineReducers({
  auth: authSlice,
  user: userSlice,
  board: boardSlice,
})
