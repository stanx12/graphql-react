/* eslint-disable no-underscore-dangle */
import express from 'express';
import bodyParser from 'body-parser';
import moongose from 'mongoose';
import { ApolloServer } from 'apollo-server-express';

import typeDefs from './graphql/schema';
import resolvers from './graphql/resolvers';

const startServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ req })
  });
  const app = express();
  server.applyMiddleware({ app });

  app.use(bodyParser.json());

  await moongose.connect(
    // eslint-disable-next-line max-len
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-lg9go.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  );

  app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  );
};

startServer();
