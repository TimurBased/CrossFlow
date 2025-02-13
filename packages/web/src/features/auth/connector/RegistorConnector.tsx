import React, { useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { RegisterView } from '../ui/RegisterView'
import { useAppSelector, useAppDispatch } from '@/hooks/useAppDispatch'
import { register } from '../model/thunks'

export const RegisterConnector: React.FC = () => {
	const { isLoading, error, isLoggedIn } = useAppSelector(state => state.auth)
	const dispatch = useAppDispatch()

	const navigate = useNavigate()

	useEffect(() => {
		if (isLoggedIn) {
			navigate('/')
		}
	}, [isLoggedIn, navigate])

	const handleSubmit = useCallback(async (values: any) => {
		await dispatch(register(values))

		return null
	}, [])
	return (
		<RegisterView
			isLoading={isLoading}
			error={error}
			isLoggedIn={isLoggedIn}
			submit={handleSubmit}
		/>
	)
}
