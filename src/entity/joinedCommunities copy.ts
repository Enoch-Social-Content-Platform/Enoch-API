import {
    Entity,
    Column,
    BaseEntity,
    PrimaryGeneratedColumn,
    // ManyToOne,
    // OneToOne,
    // JoinColumn,
    ManyToOne,
    // OneToMany,
    // ManyToMany,
    // OneToMany,
} from "typeorm";
import { Field, ObjectType, registerEnumType } from "type-graphql";

import { Community } from "./Community";
import { User } from "./User";
import { IsEnum } from "class-validator";

// enum COMMUNITYTYPE {
//     public = "public",
//     private = "private",
//     restricted = "restricted",
// }

enum REQUESTSTATUS {
    approved = "approved",
    pending = "pending",
    rejected = "rejected",
}

registerEnumType(REQUESTSTATUS, {
    name: "RequestStatus", // this one is mandatory
    description: "Status of Request", // this one is optional
});

@Entity("joinedCommunties")
@ObjectType()
export class JoinedCommunties extends BaseEntity {
    @Field(() => String)
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(() => Community, (community) => community.joinedUsers)
    // @JoinColumn()
    public community: Community;

    @ManyToOne(() => User, (user) => user.joinCommunityRequests)
    // @Field(() => String)
    public user: User;

    @Field(() => String)
    // @IsEnum(COMMUNITYTYPE)
    // @Column({
    //     type: "enum",
    //     enum: COMMUNITYTYPE,
    //     nullable: true
    // })
    communityType: string;

    @Field(() => REQUESTSTATUS)
    @IsEnum(REQUESTSTATUS)
    @Column({
        type: "enum",
        enum: REQUESTSTATUS,
        default: REQUESTSTATUS.pending
    })
    requestStatus: REQUESTSTATUS;
}
