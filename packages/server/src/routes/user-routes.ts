import express, { Router } from 'express'
import UserController from '../controller/user-controller'
import permissionMiddleware from '../middleware/permission-middleware'
import authMiddleware from '../middleware/authentificateUser-middleware'

const UserRouter: Router = express.Router()

UserRouter.post('/user', UserController.createUser)
UserRouter.get('/users', authMiddleware, UserController.getUsers)
UserRouter.get('/user/:id', UserController.getOneUser)
UserRouter.put('/user', UserController.updateUser)
UserRouter.delete('/user/:id', UserController.deleteUser)

export default UserRouter
