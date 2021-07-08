import {
  Entity,
  Column,
  BaseEntity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { Field, ObjectType } from "type-graphql";
import { User } from "./User";
@Entity("KYC")
@ObjectType()
export class KYC extends BaseEntity {
  @PrimaryGeneratedColumn("uuid") id: string;

  @OneToOne(() => User)
  @JoinColumn()
  userId: User;

  @Field(() => String)
  @Column("text")
  id1_type: String;

  @Field(() => String)
  @Column("text")
  id1_number: string;

  @Field(() => String)
  @Column("text")
  id1_expiry: string;

  @Field(() => String)
  @Column("text")
  id1_frontSide: string;

  @Field(() => String)
  @Column("text")
  id1_backSide: string;

  @Field(() => String)
  @Column("text")
  id2_type: string;

  @Field(() => String)
  @Column("text")
  id2_number: string;

  @Field(() => String)
  @Column("text")
  id2_expiry: string;

  @Field(() => String)
  @Column("text")
  id2_frontSide: string;

  @Field(() => String)
  @Column("text")
  id2_backSide: string;

  @Field(() => String)
  @Column("text")
  selfie: string;

  @Field(() => String)
  @Column("text")
  addressProof: string;
}
