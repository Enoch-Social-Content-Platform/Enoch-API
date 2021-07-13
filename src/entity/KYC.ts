import {
  Entity,
  Column,
  BaseEntity,
  PrimaryGeneratedColumn,
  ManyToOne,
} from "typeorm";
import { Field, ObjectType } from "type-graphql";
import { User } from "./User";

enum IDTYPE {
  IDCard = "ID_CARD",
  PASSPORT = "PASSPORT",
  DRIVING = "DRIVING_LICENCE",
  SELFIE = "SELFIE",
  PROOFADDRESS = "PROOF_ADRESSE",
}

@Entity("kyc")
@ObjectType()
export class Kyc extends BaseEntity {
  @PrimaryGeneratedColumn("uuid") id: string;

  @Field(() => String)
  @Column({
    type: "enum",
    enum: IDTYPE,
    default: IDTYPE.IDCard,
    nullable: false,
  })
  ID_type: IDTYPE;

  @Field(() => Number)
  @Column()
  ID_number: Number;

  @Field(() => Date)
  @Column()
  expiration_date: Date;

  @Field(() => String)
  @Column()
  img!: string;

  @ManyToOne(() => User, (user) => user.kyc)
  user: User;
}

