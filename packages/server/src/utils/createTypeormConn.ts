import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { User } from '../entity/User'
import { Post } from '../entity/Post'
import { Token } from '../entity/Token'
import dotenv from 'dotenv'
dotenv.config()

export const AppDataSource = new DataSource({
	type: 'postgres',
	host: process.env.PG_HOST,
	port: parseInt(process.env.PG_PORT || '5432'),
	username: process.env.PG_USER,
	password: process.env.PG_PASSWORD,
	database: process.env.PG_DATABASE,
	entities: [User, Post, Token],
	synchronize: true,
	logging: false,
})

export const createTypeormConn = async () => {
	try {
		await AppDataSource.initialize()
		console.log('DataSource has been initialized!')
		return AppDataSource
	} catch (err) {
		console.error('Error during DataSource initialization:', err)
		throw err
	}
}
