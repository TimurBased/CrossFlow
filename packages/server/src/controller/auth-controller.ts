import authService from '../service/auth-service'
import { Request, Response } from 'express'
// import { validUserSchema } from '@cf/common'
class AuthController {
	async registration(req: Request, res: Response): Promise<any> {
		try {
			// await validUserSchema.validate(req.body)
			const { email, password } = req.body
			const userData = await authService.registration(email, password)
			res.cookie('refreshToken', userData.tokens.refreshToken, {
				maxAge: 30,
				httpOnly: true,
			})
			res.cookie('accessToken', userData.tokens.accessToken, {
				maxAge: 24,
				httpOnly: true,
			})
			return res.json(userData)
		} catch (e) {
			console.log(e)
			return res.status(400).json({ message: 'Registration error', e })
		}
	}

	async login(req: Request, res: Response): Promise<any> {
		try {
			const { email, password } = req.body
			const userData = await authService.login(email, password)
			res.cookie('refreshToken', userData.tokens.refreshToken, {
				maxAge: 30 * 24 * 60 * 60 * 1000,
				httpOnly: true,
			})
			res.cookie('accessToken', userData.tokens.accessToken, {
				maxAge: 24 * 60 * 60 * 1000,
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
			await authService.logout(refreshToken)
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
			res.cookie('accessToken', userData.tokens.accessToken, {
				maxAge: 24 * 60 * 60 * 1000,
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
