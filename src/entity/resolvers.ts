import {
    Resolver,
    UseMiddleware,
    Ctx,
    // Query,
    Mutation,
    Arg,
    InputType,
    ObjectType,
    Field,
    Query
} from "type-graphql";

import { MyContext } from "../../types/MyContext";
import { isAuth } from "../../types/isAuth";
import { User } from "../../entity/User";
import { Earnings } from "../../entity/Income";
// import { Post } from "../../entity/Post";


enum RewardType {
    FRIENDS = "friends",
    MANDALA = "mandala",
    NOMAND = "nomand",
    ENTERTAINMENT = "entertainment"
}

enum Currency {
    amber = "amber",
    usdc = "usdc",
    enoch = "enoch",
    usdt = "usdt",
    eth = "eth",
    dai = "dai",
    wbtc = "wbtc",

}

@InputType()
@ObjectType()
class PaymentInput {
    @Field()
    type: RewardType;

    @Field()
    currency: Currency;

    @Field()
    recieverId: string;

    @Field()
    amount: number
}

@Resolver()
export class EarnResolvers {
    @Mutation(() => String)
    async sendSpinRewards(
        @Arg("paymentInput") paymentInput: PaymentInput,
    ) {
        const user = await User.findOne({ id: paymentInput.recieverId });
        if (!user) throw Error("User Not Found");

        const earning = Earnings.create({
            amount: paymentInput.amount,
            currencyType: paymentInput.currency,
            reciever: user,
            rewardType: paymentInput.type
        });
        await earning.save();

        let newbalance = (Number(user.platformtokens) + Number(paymentInput.amount)).toFixed(2)
        await User.update({ id: paymentInput.recieverId }, { platformtokens: Number(newbalance) })


        return "Transfered Successfully";
    }

    @Mutation(() => String)
    @UseMiddleware(isAuth)
    async sendGiftsRewards(
        @Arg("paymentInput") paymentInput: PaymentInput,
        @Ctx() { payload }: MyContext) {

        const user = await User.findOne({ id: payload.userId });
        if (!user) throw Error("User Not Found");
        if ((paymentInput.currency === "amber" && user.platformtokens === 0) || (paymentInput.currency === "amber" && paymentInput.amount > user.platformtokens)) {
            throw Error("Not Enough balance, Please buy")
        }
        if (paymentInput.currency !== "amber" && user.accountBalance < paymentInput.amount) {
            throw Error("Not Enough balance, Please buy")
        }
        const reciever = await User.findOne({ id: paymentInput.recieverId });
        if (!reciever) {
            throw Error("Reciener Not Found")

        }
        const earning = Earnings.create({
            amount: paymentInput.amount,
            currencyType: paymentInput.currency,
            sender: user,
            reciever: reciever,
            rewardType: paymentInput.type
        });
        await earning.save();

        let newbalance = (Number(reciever.accountBalance) + Number(paymentInput.amount)).toFixed(2)
        let deductions = (Number(user.platformtokens) - Number(paymentInput.amount)).toFixed(2)

        await User.update({ id: paymentInput.recieverId }, { accountBalance: Number(newbalance) })
        await User.update({ id: payload.userId }, { platformtokens: Number(deductions) })

        return "Gift Send Successfully";
    }

    @Mutation(() => String)
    async sendEntertainmentRewards(
        @Arg("paymentInput") paymentInput: PaymentInput,
    ) {
        const user = await User.findOne({ id: paymentInput.recieverId });
        if (!user) throw Error("User Not Found");

        const earning = Earnings.create({
            amount: paymentInput.amount,
            currencyType: paymentInput.currency,
            reciever: user,
            rewardType: paymentInput.type
        });
        await earning.save();
        let newbalance = (Number(user.platformtokens) + Number(paymentInput.amount)).toFixed(2)
        await User.update({ id: paymentInput.recieverId }, { platformtokens: Number(newbalance) })

        return "Reward Send Successfully";
    }

    @Mutation(() => String)
    async sendNomadRewards(
        @Arg("paymentInput") paymentInput: PaymentInput,
    ) {
        const user = await User.findOne({ id: paymentInput.recieverId });
        if (!user) throw Error("User Not Found");

        const earning = Earnings.create({
            amount: paymentInput.amount,
            currencyType: paymentInput.currency,
            reciever: user,
            rewardType: paymentInput.type
        });
        await earning.save();
        let newbalance = (Number(user.platformtokens) + Number(paymentInput.amount)).toFixed(2)
        await User.update({ id: paymentInput.recieverId }, { platformtokens: Number(newbalance) })

        return "Reward Send Successfully";
    }

    @Query(() => String)
    @UseMiddleware(isAuth)
    async getUserRewards(
        @Ctx() { payload }: MyContext
    ) {
        const user = await User.findOne({ id: payload.userId });
        if (!user) throw Error("User Not Found");

        const rewards = await Earnings.find({ reciever: user })
        console.log("rewards", rewards)

        return "Reward Send Successfully";
    }



}
