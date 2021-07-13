import {
  Entity,
  Column,
  BaseEntity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
} from "typeorm";
import { Field, ObjectType } from "type-graphql";

import { Ticket } from "./Tickets";
import { User } from "./User";

@Entity("message")
@ObjectType()
export class Message extends BaseEntity {
  @PrimaryGeneratedColumn("uuid") id: string;

  @OneToOne(() => Ticket, (ticket: any) => ticket.message)
  @JoinColumn({ name: "ticket_id" })
  ticket: Ticket;

  @ManyToOne(() => User)
  @JoinColumn()
  userId: User;

  @OneToMany(() => User, (user) => user.id, { nullable: true })
  @JoinColumn()
  taggeduser: User[];

  @Field(() => String)
  @Column("text")
  message_text: String;

  @Field(() => String)
  @Column("text", { nullable: true })
  attachments: String[];

  @Field(() => String)
  @Column("text", { nullable: true })
  quotted_message_id: String[];

  @Field(() => String)
  @CreateDateColumn()
  createdAt = Date();

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt = Date();
}
