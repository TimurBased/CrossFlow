import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToOne,
	JoinColumn,
} from 'typeorm'
import { User } from './User'

@Entity('tokens')
export class Token {
	@PrimaryGeneratedColumn('uuid')
	id: string

	@Column({ type: 'varchar', length: 255, nullable: true })
	refresh_token: string

	@ManyToOne(() => User, user => user.tokens, { nullable: false })
	@JoinColumn({ name: 'user_id' })
	user: User

	@Column()
	user_id: string
}
