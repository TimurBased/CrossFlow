import express from 'express'
import cookieParser from 'cookie-parser'
import userRoutes from './routes/user-routes'
import postRoutes from './routes/post-routes'
import authRoutes from './routes/auth-routes'
import dotenv from 'dotenv'
import { createTypeormConn } from './utils/createTypeormConn'
import cors from 'cors'

dotenv.config()

const PORT = process.env.PORT
const app = express()

app.use(
	cors({
		origin: process.env.FRONTEND_URL,
		credentials: true,
		methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
		allowedHeaders: ['Content-Type', 'Authorization'],
	})
)

app.use(express.json())
app.use(cookieParser())

app.use('/api', userRoutes)
app.use('/api', postRoutes)
app.use('/auth', authRoutes)

const startServer = async () => {
	try {
		await createTypeormConn()
		app.listen(PORT, () => {
			console.log(`Application started on port ${PORT}...`)
		})
	} catch (error) {
		console.error('Failed to start server:', error)
	}
}

startServer()
