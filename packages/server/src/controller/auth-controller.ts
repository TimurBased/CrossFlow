import { validationResult } from 'express-validator'
import authService from '../service/auth-service'
import { Request, Response } from 'express'

class AuthController {
	async registration(req: Request, res: Response): Promise<any> {
		try {
			const errors = validationResult(req)
			if (!errors.isEmpty()) {
				return res
					.status(400)
					.json({ message: 'Error on registration', errors })
			}

			const { username, password, email } = req.body
			const userData = await authService.registration(username, password, email)

			res.cookie('refreshToken', userData.tokens.refreshToken, {
				maxAge: 30 * 24 * 60 * 60 * 1000,
				httpOnly: true,
			})
			return res.json(userData)
		} catch (e) {
			console.log(e)
			return res.status(400).json({ message: 'Registration error' })
		}
	}

	async login(req: Request, res: Response): Promise<any> {
		try {
			const { username, password } = req.body
			const userData = await authService.login(username, password)
			res.cookie('refreshToken', userData.tokens.refreshToken, {
				maxAge: 30 * 24 * 60 * 60 * 1000,
				httpOnly: true,
			})
			res.json({ userData })
		} catch (e) {
			console.log(e)
			res.status(400).json({ message: 'Login error' })
		}
	}

	async logout(req: Request, res: Response): Promise<any> {
		try {
			const { refreshToken } = req.cookies
			const userData = await authService.logout(refreshToken)
			res.clearCookie('refreshToken')
			return res.json({ message: 'Logout successfully' })
		} catch (error) {
			console.error(error)
			return res.status(400).json({ message: 'Logout error' })
		}
	}
	async refresh(req: Request, res: Response): Promise<any> {
		try {
			const { refreshToken } = req.cookies
			const userData = await authService.refresh(refreshToken)
			res.cookie('refreshToken', userData.tokens.refreshToken, {
				maxAge: 30 * 24 * 60 * 60 * 1000,
				httpOnly: true,
			})
			res.status(200).json(userData)
		} catch (error) {
			console.error(error)
			res.status(401).json({ message: 'Internal server errors' })
		}
	}
}

export default new AuthController()
