import React, { useCallback } from 'react'
import { RegisterView } from './ui/RegisterView'
import { useAppSelector, useAppDispatch } from '../../hooks/useAppDispatch'
import { registrationThunk } from '../../features/authSlice'

export const RegisterConnector: React.FC = () => {
	const { isLoading, error } = useAppSelector(state => state.userSlice)
	const dispatch = useAppDispatch()
	const handleSubmit = useCallback(async (values: any) => {
		await dispatch(registrationThunk(values))
		return null
	}, [])
	return (
		<RegisterView isLoading={isLoading} error={error} submit={handleSubmit} />
	)
}
