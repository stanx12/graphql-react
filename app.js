import express from 'express';
import bodyParser from 'body-parser';
import graphqlHttp from 'express-graphql';
import { buildSchema } from 'graphql';

const app = express();

const events = [];
app.use(bodyParser.json());

app.use(
  '/graphql',
  graphqlHttp({
    graphiql: true,
    schema: buildSchema(`

    type Event {
      _id: ID!
      title: String!
      description: String!
      price: Float!
      date: String!
    }

    input EventInput {
      title: String!
      description: String!
      price: Float!
      date: String!
    }

    type RootQuery {
      events: [Event!]!
    }

    type RootMutation {
      createEvent(eventInput: EventInput): Event
    }

    schema {
      query: RootQuery,
      mutation: RootMutation
    }
  `),
    rootValue: {
      events: () => events,
      createEvent: (args) => {
        const { eventInput } = args;
        console.log(eventInput);
        const { title, description, price, date } = eventInput;
        const event = {
          _id: Math.random().toString(),
          title,
          description,
          price: +price,
          date,
        };
        events.push(event);
        return event;
      },
    },
  })
);

app.listen(3000);
