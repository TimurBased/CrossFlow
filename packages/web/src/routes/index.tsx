import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { RegisterConnector } from '../modules/register/RegistorConnector'

export const AppRoutes = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path='/register' Component={RegisterConnector} />
			</Routes>
		</BrowserRouter>
	)
}
