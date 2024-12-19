import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	OneToMany,
	BeforeInsert,
} from 'typeorm'
import { Post } from './Post'
import { Token } from './Token'
import bcrypt from 'bcrypt'

@Entity('users')
export class User {
	@PrimaryGeneratedColumn('uuid')
	id: string

	@Column({ type: 'varchar', length: 50, unique: true })
	username: string

	@Column({ type: 'varchar', length: 255 })
	password: string

	@Column({ type: 'varchar', length: 150 })
	email: string

	@Column({
		type: 'enum',
		enum: ['admin', 'user'],
		default: 'user',
	})
	role: string

	@OneToMany(() => Post, post => post.user)
	posts: Post[]

	@OneToMany(() => Token, token => token.user)
	tokens: Token[]

	@BeforeInsert()
	async hashPasswordBeforeInsert() {
		this.password = await bcrypt.hash(this.password, 7)
	}
}
