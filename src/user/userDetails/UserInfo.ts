// import { GraphQLObjectType } from "graphql";
import { Resolver, Mutation, Arg, Ctx, UseMiddleware } from "type-graphql";
import { User } from "../../../entity/User";
import { isAuth } from "../../../types/isAuth";
import { MyContext } from "../../../types/MyContext";
import { createSuggestions } from "../../utils/checkUsername";
import { EditResponse } from "./UserInfoTypes";
// import { EditResponse } from "./UserInfoTypes";

const Vonage = require("@vonage/server-sdk");

const VONAGE_API_KEY = process.env.VONAGE_API_KEY;
const VONAGE_API_SECRET = process.env.VONAGE_API_SECRET;
const vonage = new Vonage({
    apiKey: VONAGE_API_KEY,
    apiSecret: VONAGE_API_SECRET,
});



@Resolver()
export class UserInfoResolver {
    @Mutation(() => User)
    @UseMiddleware(isAuth)
    async UpdateUserName(
        @Arg("fullname") fullname: string,
        @Ctx() { payload }: MyContext,
    ): Promise<User> {
        const user = await User.findOne({ id: payload.userId });
        if (!user) throw Error("User Not Found");

        await User.update(user.id, {
            fullName: fullname,
            onBoarding: "step1"
        }).catch((err) => { throw err });
        return user
    }

    @Mutation(() => String)
    @UseMiddleware(isAuth)
    async verifyNumber(
        @Arg("phoneNnumber") phoneNnumber: string,
        @Ctx()
        { payload }: MyContext,
    ): Promise<any> {
        const user = await User.findOne({ id: payload.userId });
        if (!user) {
            throw Error("User Not Found")
        };

        await User.update(user.id, {
            phoneNumber: phoneNnumber,
            onBoarding: "step1"
        }).catch((err) => { throw err });

        await vonage.verify.request({
            number: phoneNnumber,
            brand: "EZD VERIFICATION",
            code_length: 6
        }, (err: Error, result: any) => {
            if (err) throw err;
            else {
                if (result["status"] == "0") {
                    return "Successfully Send Otp";
                } else {
                    throw result["error_text"];
                }
            }
        })
    }

    @Mutation(() => String)
    @UseMiddleware(isAuth)
    async verifyCode(
        @Arg("otpcode") otpcode: string,
        @Arg("requestId") requestId: string,

        @Ctx()
        { payload }: MyContext,
    ): Promise<any> {
        const user = await User.findOne({ id: payload.userId });
        if (!user) {
            throw Error("User Not Found")
        };
        vonage.verify.check(
            {
                request_id: requestId,
                code: otpcode,
            },
            async (err: Error, result: any) => {
                if (err) {
                    console.error(err);
                } else {
                    if (result["status"] == "0") {
                        //   await pgclient.query(
                        //     `UPDATE public.user SET ismobileverified = true, authenticator_type = mobile WHERE email = '${email}'`
                        //   );
                        //   return res.status(200).send("successfully verified");
                    } else {
                        //   const errormessage = result["error_text"].substring(80);
                        //   return res.status(500).send(errormessage);
                    }
                }
            }
        );
        // await User.update(user.id, {
        //     phoneNumber: otpcode,
        //     onBoarding: "step1"
        // }).catch((err) => { throw err });


    }

    @Mutation(() => EditResponse)
    @UseMiddleware(isAuth)
    async editProfile(
        @Ctx()
        { payload }: MyContext,
        @Arg("userName", { nullable: true }) userName: string,
        @Arg("city", { nullable: true }) city: string,
        @Arg("country", { nullable: true }) country: string,
        @Arg("website", { nullable: true }) website: string,
        @Arg("dateOfBirth", { nullable: true }) dateOfBirth: string,
    ): Promise<any> {
        userName
        city
        country
        website
        dateOfBirth
        const user = await User.findOne({ id: payload.userId });
        if (!user) {
            throw Error("User Not Found")
        };

        let taken = User.findOne({ userName: userName })
        let suggestions: any = []
        if (taken) {
            for (var i = 0; i < 3; i++) {
                let suggestedname = await createSuggestions(user.firstName)
                suggestions.push(suggestedname)
                console.log("ASdasd", suggestions)
            }
            console.log("suggestionssuggestions", suggestions)
            // let data = {
            //     test: suggestions[0]
            // };
            console.log("return")
            return { suggestions }
        }
        await User.update(user.id, {
            userName,
            city,
            country,
            website,
            dateOfBirth,
        }).then((res) => {
            console.log("Erer", res);
            return res
        }).catch((err) => {
            console.log("sdasda", err);
            throw err
        });
        return { ...suggestions }
    }
}
