import {
    Entity,
    BaseEntity,
    PrimaryGeneratedColumn,
    ManyToOne,
} from "typeorm";
import { Field, ObjectType } from "type-graphql";

import { User } from "./User";

@Entity("follower")
@ObjectType()
export class Follower extends BaseEntity {
    @Field(() => String)
    @PrimaryGeneratedColumn("uuid") id: string;

    @ManyToOne(() => User, user => user.follower)
    follower: User;

    @ManyToOne(() => User, user => user.following)
    following: User;
}
