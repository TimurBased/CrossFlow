import userService from '../service/user-service'
import { Request, Response } from 'express'

class UserController {
	async createUser(req: Request, res: Response): Promise<any> {
		try {
			const { id, username, password, email } = req.body
			const newUser = await userService.createUser(
				id,
				username,
				password,
				email
			)
			res.status(201).json(newUser)
		} catch (error: any) {
			console.error(error)
			res.status(500).json({ message: 'Internal server error' })
		}
	}

	async getUsers(req: Request, res: Response): Promise<any> {
		try {
			const users = await userService.getUsers()
			res.status(200).json(users)
		} catch (error: any) {
			console.error(error)
			res.status(500).json()
		}
	}

	async getOneUser(req: Request, res: Response): Promise<any> {
		try {
			const id = req.params.id
			const user = await userService.getOneUser(id)
			if (!user) {
				return res.status(404).json({ message: 'User not found' })
			}
			res.status(200).json(user)
		} catch (error) {
			console.error(error)
			res.status(500).json({ message: 'Internal server error' })
		}
	}

	async updateUser(req: Request, res: Response): Promise<any> {
		try {
			const { id, username, email } = req.body
			const updatedUser = await userService.updateUser(id, username, email)
			if (!updatedUser) {
				return res.status(404).json({ message: 'User not found' })
			}
			res.status(200).json(updatedUser)
		} catch (error) {
			console.error(error)
			res.status(500).json({ message: 'Internal server error' })
		}
	}

	async deleteUser(req: Request, res: Response): Promise<any> {
		try {
			const id = req.params.id
			const deletedUser = await userService.deleteUser(id)
			if (!deletedUser) {
				return res.status(404).json({ message: 'User not found' })
			}
			res
				.status(200)
				.json({ message: 'User deleted successfully', user: deletedUser })
		} catch (error) {
			console.error(error)
			res.status(500).json({ message: 'Internal server error' })
		}
	}

	// async refresh(req, res) {
	// 	try {
	// 		const { refreshToken } = req.cookies
	// 		const userData = await userService.refresh(refreshToken)
	// 		res.cookie('refreshToken', userData.tokens.refreshToken, {
	// 			maxAge: 30 * 24 * 60 * 60 * 1000,
	// 			httpOnly: true,
	// 		})
	// 		res.status(200).json(userData)
	// 	} catch (error) {
	// 		res.status(401).json({ message: error.message })
	// 	}
	// }
}

export default new UserController()
