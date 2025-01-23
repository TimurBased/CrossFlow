import jwt from 'jsonwebtoken'
import UserDto from '../dto/user-dto'
import { Token } from '../entity/Token'
import { AppDataSource } from '../utils/createTypeormConn'
class TokenService {
	private tokenRepository = AppDataSource.getRepository(Token)
	generateTokens(payload: UserDto) {
		const accessToken = jwt.sign(
			payload,
			process.env.JWT_ACCESS_SECRET as string,
			{
				expiresIn: '30d',
			}
		)
		const refreshToken = jwt.sign(
			payload,
			process.env.JWT_REFRESH_SECRET as string,
			{
				expiresIn: '30m',
			}
		)
		return { accessToken, refreshToken }
	}

	validateAccessToken(token: string) {
		try {
			const userData = jwt.verify(
				token,
				process.env.JWT_ACCESS_SECRET as string
			)
			return userData
		} catch (e) {
			return null
		}
	}

	validateRefreshToken(token: string) {
		const userData = jwt.verify(
			token,
			process.env.JWT_REFRESH_SECRET as string
		) as UserDto
		return userData
	}

	async saveToken(user_id: string, refresh_token: string) {
		const tokenData = await this.tokenRepository.findOne({ where: { user_id } })

		if (tokenData) {
			await this.tokenRepository.update(user_id, { refresh_token })
		} else {
			const newToken = await this.tokenRepository.create({
				refresh_token,
				user_id,
			})
			await this.tokenRepository.save(newToken)
		}
	}

	async removeToken(refresh_token: string) {
		const tokenData = await this.tokenRepository.delete({ refresh_token })
		if (tokenData) {
			return { success: true }
		}
	}

	async findToken(refresh_token: string) {
		const tokenData = await this.tokenRepository.findOne({
			where: { refresh_token: refresh_token },
		})
		return tokenData
	}
}

export default new TokenService()
