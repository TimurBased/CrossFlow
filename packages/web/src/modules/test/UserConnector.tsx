import React, { useCallback, useEffect } from 'react'
import { UserView } from './ui/UserView'
import { useAppSelector, useAppDispatch } from '../../hooks/useAppDispatch'

import { fetchUsers } from '../../features/userSlice'

export const UserConnector: React.FC = () => {
	const { userList } = useAppSelector(state => state.user)
	const dispatch = useAppDispatch()

	const handleSubmit = useCallback(async () => {
		await dispatch(fetchUsers())

		return null
	}, [])
	return <UserView userList={userList} submit={handleSubmit} />
}
