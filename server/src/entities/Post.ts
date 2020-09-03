import { ObjectType, Field, Int } from "type-graphql"
import {
	Column,
	CreateDateColumn,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
	Entity,
	BaseEntity,
	ManyToOne,
	OneToMany,
} from "typeorm"
import { User } from "./User"
import { Updoot } from "./Updoot"

@ObjectType()
@Entity()
export class Post extends BaseEntity {
	@Field()
	@PrimaryGeneratedColumn()
	id!: number

	@Field()
	@Column()
	title!: string

	@Field()
	@Column()
	text!: string

	@Field()
	@Column({ type: "int", default: 0 })
	points!: number

	@Field(() => Int, { nullable: true })
	voteStatus: number | null

	@Field()
	@Column()
	creatorId: number

	@Field()
	@ManyToOne(() => User)
	creator: User

	@OneToMany(() => Updoot, (updoot) => updoot.post)
	updoots: Updoot[]

	@Field(() => String)
	@CreateDateColumn()
	createdAt: Date

	@Field(() => String)
	@UpdateDateColumn()
	updatedAt: Date
}
