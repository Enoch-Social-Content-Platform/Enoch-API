import * as bcrypt from "bcryptjs";
import {
  Entity,
  Column,
  BaseEntity,
  PrimaryGeneratedColumn,
  BeforeInsert,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Field, ObjectType } from "type-graphql";
import { Kyc } from "./Kyc";

enum userType {
  Admin = "admin",
  business = "business",
  support = "support",
  Kycteam = "Kyc",
  individual = "individual",
}

@Entity("users")
@Unique(["email"])
@ObjectType()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn("uuid") id: string;

  @Field(() => String)
  @Column("varchar", { length: 255 })
  email: string;

  @Field()
  @Column("varchar", { length: 255 })
  firstName: string;

  @Field()
  @Column("varchar", { length: 255 })
  lastName: string;

  @Field()
  @Column("varchar", { nullable: true, length: 255 })
  middleName: string;

  @Column("text")
  password: string;

  @Field(() => String)
  @Column("boolean", { default: false })
  confirmed: boolean;

  @Column("text", { nullable: true })
  country: string;

  @Field(() => String)
  @Column("text", { nullable: true })
  phoneNumber: String;

  @Field(() => String)
  @Column({
    type: "enum",
    enum: userType,
    default: userType.individual,
    nullable: true,
  })
  userType: userType;

  @Field(() => String)
  @Column({ type: "date", nullable: true })
  dateOfBirth: Date;

  @Field(() => String)
  @Column("text", { nullable: true })
  address1: String;

  @Field(() => String)
  @Column("text", { nullable: true })
  address2: String;

  @Field(() => String)
  @Column("text", { nullable: true })
  city: String;

  @Field(() => String)
  @Column("text", { nullable: true })
  postalCode: String;

  @Field(() => String)
  @CreateDateColumn()
  createdAt = Date();

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt = Date();

  @OneToMany(() => Kyc, (kyc) => kyc.user)
  kyc: Kyc;

  @BeforeInsert()
  async hashPasswordBeforeInsert() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
