import express, { Router } from 'express'
import AuthController from '../controller/auth-controller'
import { check } from 'express-validator'

const AuthRouter: Router = express.Router()

AuthRouter.post(
	'/registration',
	[
		check('username', 'username can not be null').notEmpty(),
		check('password', 'min length password 4 symbols and max 20').isLength({
			min: 4,
			max: 20,
		}),
	],
	AuthController.registration
)

AuthRouter.post('/login', AuthController.login)
AuthRouter.post('/logout', AuthController.logout)
AuthRouter.post('/refresh', AuthController.refresh)

export default AuthRouter
