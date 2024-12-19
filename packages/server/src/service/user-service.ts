import { dataSource } from '../data-source/data-source'
import { User } from '../entity/User'

class UserService {
	private userRepository = dataSource.getRepository(User)

	async createUser(
		id: string,
		username: string,
		password: string,
		email: string
	) {
		const newUser = this.userRepository.create({
			id,
			username,
			password,
			email,
		})
		await this.userRepository.save(newUser)
		return newUser
	}

	async getUsers() {
		try {
			return await this.userRepository.find()
		} catch (error) {
			console.error('Error while fetching users:', error)
			throw error
		}
	}

	async getOneUser(id: string) {
		return await this.userRepository.findOne({ where: { id: id } })
	}

	async updateUser(id: string, username: string, email: string) {
		if (!id) {
			throw new Error('User ID is required')
		}
		await this.userRepository.update(id, { username, email })
		return this.userRepository.findOne({ where: { id } })
	}

	async deleteUser(id: string) {
		const user = await this.userRepository.findOne({ where: { id } })
		if (!user) {
			throw new Error('User not found')
		}
		await this.userRepository.delete(id)
		return user
	}
}

export default new UserService()
