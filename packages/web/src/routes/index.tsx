import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { RegisterConnector } from '../modules/auth/register/RegistorConnector'
import { LoginConnector } from '../modules/auth/login/LoginConnector'
import { useAppSelector } from '../hooks/useAppDispatch'
import { UserConnector } from '../modules/test/UserConnector'
export const AppRoutes = () => {
	const user = useAppSelector(state => state.auth)
	console.log(user)
	return (
		<BrowserRouter>
			<Routes>
				<Route path='/register' Component={RegisterConnector} />
				<Route path='/login' Component={LoginConnector} />
				<Route path='/users' Component={UserConnector} />
			</Routes>
		</BrowserRouter>
	)
}
