import jwt from 'jsonwebtoken'
import { NextFunction, Request, Response } from 'express'
import UserDto from '../dto/user-dto'

export default function roleMiddleware(
	req: Request,
	res: Response,
	next: NextFunction
): any {
	if (req.method === 'OPTIONS') {
		return next() // Продолжаем выполнение для preflight-запросов
	}

	try {
		const authToken = req.cookies.refreshToken
		console.log(authToken)
		if (!authToken) {
			return res.status(403).json({ message: 'Unauthorized' })
		}
		const decodedData = jwt.verify(
			authToken,
			process.env.JWT_REFRESH_SECRET as string
		) as UserDto
		if (decodedData.role !== 'admin') {
			return res
				.status(403)
				.json({ message: 'Access denied: insufficient privileges' })
		}

		next()
	} catch (e) {
		console.error(e)
		return res.status(403).json({ message: 'Authorization error' })
	}
}
