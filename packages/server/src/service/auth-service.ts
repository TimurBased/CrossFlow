import bcrypt from 'bcrypt'
import tokenService from '../service/token-service'
import UserDto from '../dto/user-dto'
import { AppDataSource } from '../utils/createTypeormConn'
import { User } from '../entity/User'

class AuthService {
	private userRepository = AppDataSource.getRepository(User)

	async registration(email: string, password: string) {
		console.log('вошли в сервис авторизации')
		const candidate = await this.userRepository.findOne({
			where: { email: email },
		})

		if (candidate) {
			throw new Error('A user with this name already exists')
		}

		const newUser = this.userRepository.create({
			email,
			password,
		})

		await this.userRepository.save(newUser)
		const userDto = new UserDto(newUser.id, newUser.email, newUser.role)
		const tokens = tokenService.generateTokens({ ...userDto })

		await tokenService.saveToken(userDto.id, tokens.refreshToken)
		return { ...userDto, tokens }
	}

	async login(email: string, password: string) {
		const candidate = await this.userRepository.findOne({
			where: { email: email },
		})
		if (!candidate) {
			throw new Error(`A user with that name ${email} does not exist`)
		}

		if (candidate.password !== password) {
			const validPassword = bcrypt.compareSync(password, candidate.password)
			if (!validPassword) {
				throw new Error('Password is not valid')
			}
		}

		const userDto = new UserDto(candidate.id, candidate.email, candidate.role)
		const tokens = tokenService.generateTokens({ ...userDto })
		await tokenService.saveToken(userDto.id, tokens.refreshToken)
		return { ...userDto, tokens }
	}

	async logout(refreshToken: string) {
		const result = await tokenService.removeToken(refreshToken)
		return result
	}

	async refresh(refreshToken: string) {
		const userData = tokenService.validateRefreshToken(refreshToken)

		const candidate = await this.userRepository.findOne({
			where: { id: userData.id },
		})

		const tokenFromDb = tokenService.findToken(refreshToken)

		if (!userData?.id || !tokenFromDb || !candidate) {
			throw new Error('Unauthorized')
		}

		const userDto = new UserDto(candidate.id, candidate.email, candidate.role)

		const tokens = tokenService.generateTokens({ ...userDto })

		await tokenService.saveToken(userDto.id, tokens.refreshToken)

		return { ...userDto, tokens }
	}
}

export default new AuthService()
