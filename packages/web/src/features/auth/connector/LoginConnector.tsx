import React, { useCallback } from 'react'
import { LoginView } from '@/features/auth/ui/LoginView'
import { useAppSelector, useAppDispatch } from '@/hooks/useAppDispatch'
import { login } from '../model/thunks'

export const LoginConnector: React.FC = () => {
  const { isLoading, error } = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()
  const handleSubmit = useCallback(async (values: any) => {
    await dispatch(login(values))

    return null
  }, [])
  return <LoginView isLoading={isLoading} error={error} submit={handleSubmit} />
}
