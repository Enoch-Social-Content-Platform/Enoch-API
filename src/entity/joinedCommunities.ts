import {
    Entity,
    Column,
    BaseEntity,
    PrimaryGeneratedColumn,
    // ManyToOne,
    // OneToOne,
    JoinColumn,
    ManyToOne,
    // ManyToMany,
    // OneToMany,
} from "typeorm";
import { Field, ObjectType } from "type-graphql";

import { Community } from "./community";
import { User } from "./User";

@Entity("joinedCommunties")
@ObjectType()
export class JoinedCommunties extends BaseEntity {
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

    @Field(() => Boolean)
    @Column("boolean", { default: false })
    approved: boolean;
}
