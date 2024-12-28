import * as React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
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
