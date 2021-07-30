import {
    Resolver,
    Mutation,
    Arg,
    Ctx,
    UseMiddleware
} from "type-graphql";
import { FileUpload, GraphQLUpload } from "graphql-upload";


import { Post } from "../../../entity/Posts";
import { User } from "../../../entity/User";
import { isAuth } from "../../../types/isAuth";
import { MyContext } from "../../../types/MyContext";
import { createSuggestions } from "../../utils/checkUsername";

import { responseType } from "./UserInfoTypes";
import { uploadFiles } from "../../../utils/uploadFiles";
import { ProfileViews } from "../../../entity/ProfileView";

const Vonage = require("@vonage/server-sdk");

const VONAGE_API_KEY = process.env.VONAGE_API_KEY;
const VONAGE_API_SECRET = process.env.VONAGE_API_SECRET;
const vonage = new Vonage({
    apiKey: VONAGE_API_KEY,
    apiSecret: VONAGE_API_SECRET,
});

enum onboardingStatus {
    incomplete = "incomplete",
    completed = "completed",
}

@Resolver()
export class UserInfoResolver {
    @Mutation(() => User)
    @UseMiddleware(isAuth)
    async UpdateFullName(
        @Arg("fullname") fullname: string,
        @Ctx() { payload }: MyContext,
    ): Promise<User> {
        const user = await User.findOne({ id: payload.userId });
        if (!user) throw Error("User Not Found");

        await User.update(user.id, {
            fullName: fullname,
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
                    } else {
                    }
                }
            }
        );
    }

    @Mutation(() => responseType)
    @UseMiddleware(isAuth)
    async editProfile(
        @Ctx()
        { payload }: MyContext,
        @Arg("userName", { nullable: true }) userName: string,
        @Arg("city", { nullable: true }) city: string,
        @Arg("country", { nullable: true }) country: string,
        @Arg("website", { nullable: true }) website: string,
        @Arg("dateOfBirth", { nullable: true }) dateOfBirth: string,
        @Arg("file", () => GraphQLUpload, { nullable: true },)
        file: FileUpload,
    ): Promise<any> {
        const user = await User.findOne({ id: payload.userId });
        if (!user) {
            throw Error("User Not Found")
        };
        let taken = await User.findOne({ userName: userName })
        let suggestion: any = []
        if (taken) {
            for (var i = 0; i < 3; i++) {
                let suggestedname = await createSuggestions(user.firstName)
                suggestion.push(suggestedname)
            }
            let response = {
                suggestion: suggestion,
                message: "User Name Already taken",
                success: false
            };
            return response
        }
        else {
            let uploaddata: any = {
                userName,
                city,
                country,
                website,
                dateOfBirth,
                onBoarding: onboardingStatus.completed
            }
            let image = '';
            if (file) {
                image = await uploadFiles(file, user.id)
                uploaddata["profileImage"] = image
            }
            const update = await User.update(user.id, uploaddata)
            if (update) {
                return {
                    success: true,
                    message: "Updated Succesfully"
                }
            }
        }
    }

    @Mutation(() => User)
    @UseMiddleware(isAuth)
    async getUserProfile(
        @Ctx()
        { payload }: MyContext,
        @Arg("userId") userId: string,

    ): Promise<User | undefined> {
        userId
        const user = await User.findOne({ id: payload.userId });
        if (!user) {
            throw Error("User Not Found")
        };

        await ProfileViews.create({
            viewed_id: userId,
            viewer: payload.userId,
        })
        let UserData = await User.findOne({
            where: { id: userId },
            relations: ['posts'],
        })
        return UserData

    }

    @Mutation(() => Post)
    @UseMiddleware(isAuth)
    async createPosts(
        @Arg("description") description: String,
        @Ctx()
        { payload }: MyContext,
    ): Promise<Post> {
        const Posts = await Post.create({
            description: description,
            user_id: payload.userId
        }).save();
        return Posts
    }

}
