import { Field, ObjectType } from "type-graphql";
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { User } from "./User";

enum Currency {
    amber = "amber",
    usdc = "usdc",
    enoch = "enoch",
    usdt = "usdt",
    eth = "eth",
    dai = "dai",
    wbtc = "wbtc",

}

enum RewardType {
    FRIENDS = "friends",
    MANDALA = "mandala",
    NOMAND = "nomand",
    ENTERTAINMENT = "entertainment"
}


@ObjectType()
@Entity("earning")
export class Earnings extends BaseEntity {
    @Field(() => String)
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(() => User, {
        eager: true,
        onDelete: "CASCADE",
        nullable: true
    })
    public sender: User;

    @ManyToOne(() => User, {
        eager: true,
        onDelete: "CASCADE",
    })
    public reciever: User;

    @Field(() => Number)
    @Column("numeric", { precision: 10, scale: 2 })
    amount: number;

    @Field(() => String)
    @Column({
        type: "enum",
        enum: Currency,
        default: Currency.amber
    })
    currencyType: Currency;

    @Field(() => String)
    @Column({
        type: "enum",
        enum: RewardType,
    })
    rewardType: RewardType;

    @Field(() => Date)
    @Column()
    @CreateDateColumn()
    public createdAt: Date;

    @Field(() => Date)
    @Column()
    @UpdateDateColumn()
    public updatedAt: Date;
}
