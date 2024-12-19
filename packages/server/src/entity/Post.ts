import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToOne,
	JoinColumn,
} from 'typeorm'
import { User } from './User'

@Entity('posts')
export class Post {
	@PrimaryGeneratedColumn('uuid')
	id: string

	@Column({ type: 'varchar', length: 255, nullable: true })
	title: string

	@Column({ type: 'varchar', length: 255, nullable: true })
	description: string

	@ManyToOne(() => User, user => user.posts, { nullable: false })
	@JoinColumn({ name: 'user_id' })
	user: User

	@Column()
	user_id: string
}
