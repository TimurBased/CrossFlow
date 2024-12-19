import express, { Express } from 'express'
import cookieParser from 'cookie-parser'
import UserRouter from './src/routes/user-routes'
import PostRouter from './src/routes/post-routes'
import AuthRouter from './src/routes/auth-routes'
import dotenv from 'dotenv'
import { dataSource } from './src/data-source/data-source'
// import swaggerUi from 'swagger-ui-express'
// import swaggerDocument from './swagger/swagger_output.json' assert { type: 'json' }

dotenv.config()

const PORT = process.env.PORT || 5000
const app = express()

app.use(express.json())
app.use(cookieParser())

// app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.use('/api', UserRouter)
app.use('/api', PostRouter)
app.use('/auth', AuthRouter)
dataSource
	.initialize()
	.then(() => {
		console.log('DataSource has been initialized!')
		app.listen(PORT, () => console.log(`Application started on ${PORT}...`))
	})
	.catch(err => {
		console.error('Error during DataSource initialization:', err)
	})
