import { Field, ObjectType } from "type-graphql";
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
    Unique,
    UpdateDateColumn,
} from "typeorm";

import { User } from "./User";

@ObjectType()
@Entity("affiliation")
@Unique(["reffrenceCode", "referrer"])

export class Affiliations extends BaseEntity {
    @Field(() => String)
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @OneToOne(() => User, {
        eager: true,
        onDelete: "CASCADE",
    })
    @JoinColumn()
    public referrer: User;

    @Field(() => String)
    @Column("text", { nullable: false, unique: true })
    reffrenceCode: string;

    @Field(() => String)
    @Column("text", { nullable: false, unique: true })
    referralLink: string;

    @Field(() => Date)
    @Column()
    @CreateDateColumn()
    public createdAt: Date;

    @Field(() => Date)
    @Column()
    @UpdateDateColumn()
    public updatedAt: Date;
}
