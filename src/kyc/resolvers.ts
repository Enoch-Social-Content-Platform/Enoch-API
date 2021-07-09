import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { FileUpload, GraphQLUpload } from "graphql-upload";

import { createWriteStream } from "fs";
import { Kyc } from "../../../../entity/Kyc";
import { isAuth } from "../../../../types/isAuth";
import { User } from "../../../../entity/User";
import { MyContext } from "../../../../types/MyContext";
import { Inputkyc } from "./KycTypes";

@Resolver()
export class createkyc {
  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async KycUserIdDocumentation(
    @Arg("file", () => GraphQLUpload)
    { createReadStream, filename }: FileUpload,
    @Arg("input") input: Inputkyc,
    @Ctx() { payload }: MyContext
  ) {
    return new Promise(async (resolve, reject) =>
      createReadStream()
        .pipe(createWriteStream(__dirname + `/images/${filename}`))
        .on("finish", async () => {
          let kyc = Kyc.create({
            ...input,
            img: `/images/${filename}`,
          });
          let user = await User.findOne({ id: payload.userId });
          if (user) kyc.user = user;
          kyc.save();
          resolve(true);
        })
        .on("error", (err) => reject(err))
    );
  }
}
