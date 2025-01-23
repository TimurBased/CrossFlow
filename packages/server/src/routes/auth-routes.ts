import express, { Router } from 'express'
import AuthController from '../controller/auth-controller'

const AuthRouter: Router = express.Router()

AuthRouter.post('/registration', AuthController.registration)
AuthRouter.post('/login', AuthController.login)
AuthRouter.post('/logout', AuthController.logout)
AuthRouter.post('/refresh', AuthController.refresh)

export default AuthRouter
