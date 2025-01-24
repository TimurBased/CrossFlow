import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { RegisterConnector } from '../modules/auth/register/RegistorConnector'
import { LoginConnector } from '../modules/auth/login/LoginConnector'

export const AppRoutes = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path='/register' Component={RegisterConnector} />
				<Route path='/login' Component={LoginConnector} />
			</Routes>
		</BrowserRouter>
	)
}
