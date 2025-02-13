import React from 'react'
import { LoginConnector } from '../../features/auth/connector/LoginConnector'
export const LoginPage: React.FC = () => {
	return (
		<>
			<h1>This Login page</h1>
			<LoginConnector></LoginConnector>
		</>
	)
}
