/* eslint-disable no-underscore-dangle */
import express from 'express';
import bodyParser from 'body-parser';
import graphqlHttp from 'express-graphql';
import moongose from 'mongoose';

import schema from './graphql/schema';
import resolvers from './graphql/resolvers';

const app = express();

app.use(bodyParser.json());

app.use(
  '/graphql',
  graphqlHttp({
    graphiql: true,
    schema,
    rootValue: resolvers
  })
);

moongose
  .connect(
    // eslint-disable-next-line max-len
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-lg9go.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    app.listen(3000);
    console.log('Server started');
  })
  .catch(err => console.log(err));
