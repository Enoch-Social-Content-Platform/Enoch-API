import {
  Resolver,
  UseMiddleware,
  Ctx,
  Mutation,
  Arg,
  InputType,
  ObjectType,
  Field,
  Query,
} from "type-graphql";

import { MyContext } from "../../types/MyContext";
import { isAuth } from "../../types/isAuth";
import { User } from "../../entity/User";
import { Post } from "../../entity/Post";
import { Comment } from "../../entity/Comment";
import { Photo } from "../../entity/Photo";
import { Share } from "../../entity/Share";
import { getConnection, getRepository } from "typeorm";
import { validate } from "class-validator";
import { FileUpload, GraphQLUpload } from "graphql-upload";
import { createWriteStream } from "fs";

@InputType()
@ObjectType()
class PostInput {
  @Field()
  title: string;

  @Field({ nullable: true })
  url: string;

  @Field({ nullable: true })
  text: string;
}

@InputType()
@ObjectType()
class CommentInput {
  @Field()
  text: string;
}

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  @UseMiddleware(isAuth)
  async getAll(@Ctx() { payload }: MyContext) {
    const user = await User.findOne({ id: payload.userId });
    if (!user) throw Error("User Not Found");
    const posts = await Post.find();
    return posts;
  }

  @Query(() => Post)
  @UseMiddleware(isAuth)
  async getOneById(@Arg("id") id: string): Promise<Post> {
    const postRepository = getRepository(Post);
    try {
      const post = await postRepository.findOneOrFail(id);
      return post;
    } catch (error) {
      throw new Error("Post not found");
    }
  }

  @Query(() => [Post])
  @UseMiddleware(isAuth)
  async getUserPost(@Ctx() { payload }: MyContext) {
    const user = await User.findOne({ id: payload.userId });
    if (!user) throw Error("User Not Found");
    const qb = getConnection()
      .getRepository(Post)
      .createQueryBuilder("post")
      .innerJoinAndSelect("post.user", "u", "u.id = post.user")
      .where("post.user = :id", { id: payload.userId });
    const post = await qb.getMany();
    return post;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async addPostPhotos(
    @Arg("file", () => GraphQLUpload)
    { createReadStream, filename }: FileUpload,
    @Arg("id") id: string,
    @Ctx() { payload }: MyContext
  ) {
    const postRepository = getRepository(Post);
    let post: Post;
    try {
      post = await postRepository.findOneOrFail(id);
    } catch (error) {
      throw new Error("Post not found");
    }
    return new Promise(async (resolve, reject) =>
      createReadStream()
        .pipe(createWriteStream(__dirname + `/images/${filename}`))
        .on("finish", async () => {
          const user = await User.findOne({ id: payload.userId });
          if (!user) throw Error("User Not Found");
          const photo = new Photo();
          photo.url = "me.jpg";
          photo.post = post;
          await Post.update({ id: payload.userId }, { photos: [photo] }).catch(
            (err: any) => {
              throw err;
            }
          );
          resolve(true);
        })
        .on("error", (err: Error) => reject(err))
    );
  }

  @Mutation(() => String)
  @UseMiddleware(isAuth)
  async createPost(
    @Arg("PostInput") { title, url, text }: PostInput,
    @Ctx()
    { payload }: MyContext
  ): Promise<String> {
    const userRepository = getRepository(User);
    let user;
    try {
      user = await userRepository.findOneOrFail({ id: payload.userId });
    } catch (error) {
      throw new Error("User not found.");
    }
    if (url && text) {
      throw new Error("Sorry, you can either post a url or text, not both! 😾");
    }
    const post = new Post();
    post.title = title;
    post.url = url || "";
    post.text = text || "";
    post.user = user;
    const errors = await validate(post);
    if (errors.length > 0) {
      throw new Error("Post not valid");
    }
    const postRepository = getRepository(Post);
    try {


      await postRepository.save(post);
    } catch (e) {
      console.log(e);
      throw new Error("Sorry, something went wrong!");
    }

    return "Post created";
  }


}
