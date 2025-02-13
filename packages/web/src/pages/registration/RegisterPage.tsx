import React from 'react'
import { RegisterConnector } from '../../features/auth/connector/RegistorConnector'
export const RegistrationPage: React.FC = () => {
	return (
		<>
			<h1>This Register page</h1>
			<RegisterConnector></RegisterConnector>
		</>
	)
}
