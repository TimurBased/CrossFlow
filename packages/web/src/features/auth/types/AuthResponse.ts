import { IUser } from '../../../shared/types/IUser'

export interface AuthResponse {
	userData: {
		user: IUser
		tokens: {
			accessToken: string
			refreshToken: string
		}
	}
}
