import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { User } from '../entity/User'
import { Post } from '../entity/Post'
import { Token } from '../entity/Token'
export const dataSource = new DataSource({
	type: 'postgres',
	host: 'localhost',
	port: 5432,
	username: 'postgres',
	password: 'root',
	database: 'mydb',
	entities: [User, Post, Token],
	synchronize: true,
	logging: true,
})
