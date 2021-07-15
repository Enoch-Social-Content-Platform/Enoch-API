import {
  Resolver,
  Query,
  UseMiddleware,
  Ctx,
  Mutation,
  InputType,
  Field,
  ArgsType,
  Args,
  Arg,
} from "type-graphql";

import { MyContext } from "../../types/MyContext";
import { isAuth } from "../../types/isAuth";

import { Ticket } from "../../entity/Tickets";
import { Message } from "../../entity/Message";
import { TicketActivity } from "../../entity/TicketActivity";
import { FileUpload, GraphQLUpload } from "graphql-upload";
import { User } from "../../entity/User";
import { getConnection } from "typeorm";

@InputType()
class MessageInput {
  @Field()
  message: String;
}

enum TICKETCATEGORY {
  KYC_AML = "kyc_aml",
  PROFILE = "profile",
  ACCOUNT = "account",
  EXCHANGE = "exchange",
  LAUNCHPAD = "launchpad",
  FARMING = "farming",
  SECURITY = "security",
  PROMOTION = "promotion",
}

enum ACTIVITYTYPE {
  OPENED = "open",
  JOINED = "joined",
  LEFT = "left",
  TRANSFERED = "transfered",
  INVITED = "invited",
  SOLVED = "sloved",
  CLOSED = "closed",
}

@ArgsType()
class TicketArgs {
  @Field()
  subject: String;

  @Field()
  category: TICKETCATEGORY;

  @Field()
  messageInput: MessageInput;

  @Field(() => GraphQLUpload, { nullable: true })
  files?: [FileUpload];
}

@Resolver()
export class TicketResolver {
  @Query(() => [Ticket])
  @UseMiddleware(isAuth)
  async getUserTickets(@Ctx() { payload }: MyContext) {
    const user = await User.findOne({ id: payload.userId });
    if (!user) throw Error("User Not Found");
    const qb = getConnection()
      .getRepository(Ticket)
      .createQueryBuilder("ticket")
      .innerJoinAndSelect("ticket.user", "u", "u.id = ticket.user")
      .where("ticket.user = :id", { id: payload.userId });
    const ticket = await qb.getMany();
    // const ticket = await Ticket.find({
    //   relations: ["user"],
    // });
    return ticket;
  }

  @Mutation(() => Ticket)
  // @UseMiddleware(isAuth)
  async createTickets(
    // @Arg("ticketinput") input: InputTicket,
    @Args() { subject, category, messageInput }: TicketArgs,
    // @Ctx()
    // { payload }: MyContext,
    @Arg("files", () => GraphQLUpload)
    files?: [FileUpload]
  ): Promise<Ticket> {
    try {
      console.log("ticket resolver", files);
      const ticket = await Ticket.create({
        // user: { id: payload.userId },
        subject: subject,
        category: category,
        files: files ? true : false,
      }).save();
      if (!files) {
        await Message.create({
          ticket: ticket,
          message_text: messageInput.message,
          // userId: { id: payload.userId },
        }).save();
      } else {
      }

      await TicketActivity.create({
        ticket: ticket,
        // user: { id: payload.userId },
        activity_type: ACTIVITYTYPE.OPENED,
      }).save();
      return ticket;
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  }
}
