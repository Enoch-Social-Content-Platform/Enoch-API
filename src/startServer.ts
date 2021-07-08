import "reflect-metadata";
import "dotenv/config";

import * as express from "express";
import { ApolloServer } from "apollo-server-express";
import { generateSchema } from "./modules/createSchema";
import { createTypeormConn } from "./utils/createTypeormConn";
import { graphqlUploadExpress } from "graphql-upload";
export const startServer = async () => {
  try {
    await createTypeormConn();
  } catch (err) {
    console.log("error", err);
  }

  const schema = await generateSchema();
  const appoloServer = new ApolloServer({
    schema,
    context: ({ req, res }) => ({ req, res }),
  });
  const app = express();

  app.use(
    graphqlUploadExpress({
      maxFileSize: 30000000,
      maxFiles: 20,
    })
  );
  appoloServer.applyMiddleware({ app });
  app.listen(3000, () => {
    console.log("express server started");
  });
};
