import {
    Entity,
    Column,
    BaseEntity,
    PrimaryGeneratedColumn,
    // OneToOne,
    JoinColumn,
    ManyToOne,
} from "typeorm";
import { Field, ObjectType } from "type-graphql";

import { Community } from "./community";
import { User } from "./User";

@Entity("joinCommunityRequest")
@ObjectType()
export class JoinCommunityRequest extends BaseEntity {
    @Field(() => String)
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(() => Community)
    @Field()
    @JoinColumn()
    community: Community;

    @ManyToOne(() => User, (user) => user.joinCommunityRequests)
    @Field(() => String)
    user: User;

    @Field(() => String)
    @Column("text", { default: "I would like to join this community" })
    message: string;

}
