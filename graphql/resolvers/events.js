/* eslint-disable no-underscore-dangle */
import { dateToString } from '../../utils';
import { Event, User } from '../../models';
import isAuth from '../../middleware/is-auth';

import { transformEvent } from './merge';

export default {
  Query: {
    events: async () => {
      try {
        const ev = await Event.find().populate('creator');

        return ev.map(event => transformEvent(event));
      } catch (err) {
        console.log(err);

        throw err;
      }
    }
  },
  Mutation: {
    createEvent: async (_, { eventInput }, context) => {
      if (!isAuth(context)) {
        return null;
      }

      const { userId } = context.req;
      const { title, description, price, date } = eventInput;

      const event = new Event({
        title,
        description,
        price,
        date: dateToString(date),
        creator: userId
      });

      try {
        const result = await event.save();
        const createdEvent = transformEvent(result);
        const userFound = await User.findById(userId);

        if (!userFound) {
          throw new Error('User not found');
        }

        userFound.createdEvents.push(event);
        await userFound.save();

        return createdEvent;
      } catch (err) {
        console.log(err);

        throw err;
      }
    }
  }
};
