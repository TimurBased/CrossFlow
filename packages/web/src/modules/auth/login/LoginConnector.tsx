import React, { useCallback } from 'react'
import { LoginView } from './ui/LoginView'
import { useAppSelector, useAppDispatch } from '../../../hooks/useAppDispatch'
import { loginThunk } from '../../../features/authSlice'

export const LoginConnector: React.FC = () => {
	const { isLoading, error } = useAppSelector(state => state.userSlice)
	const dispatch = useAppDispatch()
	const handleSubmit = useCallback(async (values: any) => {
		await dispatch(loginThunk(values))
		return null
	}, [])
	return <LoginView isLoading={isLoading} error={error} submit={handleSubmit} />
}
