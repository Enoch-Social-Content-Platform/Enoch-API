import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class EditResponse {
    @Field(() => String)
    suggestion: string[];
}