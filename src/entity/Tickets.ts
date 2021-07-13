import {
    Entity,
    Column,
    BaseEntity,
    PrimaryGeneratedColumn,
    OneToOne,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
  } from "typeorm";
  import { Field, ObjectType } from "type-graphql";
  
  import { User } from "./User";
  import { Message } from "./Message";
  
  enum TICKETSTATUS {
    OPEN = "open",
    IN_PROGRESS = "inprogress",
    SOLVED = "solved",
    CLOSED = "closed",
    PROOFADDRESS = "PROOF_ADRESSE",
  }
  
  @Entity("tickets")
  @ObjectType()
  export class Ticket extends BaseEntity {
    @PrimaryGeneratedColumn("uuid") id: string;
  
    @ManyToOne(() => User, (user) => user.tickets, { onDelete: "CASCADE" })
    @JoinColumn({ name: "user_id" })
    user: User;
  
    @Field(() => String)
    @Column("text", { nullable: true })
    category: String;
  
    @Field(() => String)
    @Column("text", { nullable: true })
    subject: String;
  
    @Field(() => String)
    @Column({
      type: "enum",
      enum: TICKETSTATUS,
      default: TICKETSTATUS.OPEN,
      nullable: false,
    })
    ticket_status: TICKETSTATUS;
  
    @ManyToOne(() => User, (user) => user.tickets, { nullable: true })
    @JoinColumn({ name: "user_id" })
    paticipants: User[];
  
    @OneToOne(() => Message, (message: any) => message.ticket, {
      onDelete: "CASCADE",
    })
    message: Message;
  
    @Field(() => String)
    @CreateDateColumn()
    createdAt = Date();
  
    @Field(() => String)
    @UpdateDateColumn()
    updatedAt = Date();
  }
  