export interface AuthResponse {
	tokens: {
		accessToken: string
		refreshToken: string
	}
	userData: { id: string; email: string; role: string }
}
