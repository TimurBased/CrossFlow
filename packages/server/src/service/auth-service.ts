import bcrypt from 'bcrypt'
import tokenService from '../service/token-service'
import UserDto from '../dto/user-dto'
import { dataSource } from '../data-source/data-source'
import { User } from '../entity/User'

class AuthService {
	private userRepository = dataSource.getRepository(User)

	async registration(username: string, password: string, email: string) {
		const candidate = await this.userRepository.findOne({
			where: { username: username },
		})

		if (candidate) {
			throw new Error('A user with this name already exists')
		}
		const newUser = this.userRepository.create({
			username,
			password,
			email,
		})
		await this.userRepository.save(newUser)
		const userDto = new UserDto(newUser.id, newUser.email, newUser.role)
		const tokens = tokenService.generateTokens({ ...userDto })

		await tokenService.saveToken(userDto.id, tokens.refreshToken)
		return { ...userDto, tokens }
	}

	async login(username: string, password: string) {
		const candidate = await this.userRepository.findOne({
			where: { username: username },
		})
		if (!candidate) {
			throw new Error(`A user with that name ${username} does not exist`)
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
