import { api } from '../api/axios'

class UserService {
	async fetchAllUser() {
		const response = await api.get('/api/users')
		return response.data
	}
}
export default new UserService()
