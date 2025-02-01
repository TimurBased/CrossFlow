import jwt from 'jsonwebtoken'
import { NextFunction, Request, Response } from 'express'
import UserDto from '../dto/user-dto'

export default function authMiddleware(
	req: Request,
	res: Response,
	next: NextFunction
): any {
	if (req.method === 'OPTIONS') {
		return next()
	}

	try {
		const authToken = req.cookies.accessToken

		if (!authToken) {
			return res.status(401).json({ message: 'Unauthorized' })
		}
		const decodedData = jwt.verify(
			authToken,
			process.env.JWT_ACCESS_SECRET as string
		) as UserDto
		next()
	} catch (e) {
		if (e instanceof jwt.TokenExpiredError) {
			return res.status(401).json({ message: 'Token expired' })
		}
		console.error(e)
		return res.status(401).json({ message: 'Unauthorized' })
	}
}
