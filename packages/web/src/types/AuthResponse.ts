import { IUser } from './IUser'

export interface AuthResponse {
	userData: {
		user: IUser
		tokens: {
			accessToken: string
			refreshToken: string
		}
	}
}
