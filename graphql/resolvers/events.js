/* eslint-disable no-underscore-dangle */
import { dateToString } from '../../utils';
import { Event, User } from '../../models';

import { transformEvent } from './merge';

export default {
  events: async () => {
    try {
      const ev = await Event.find().populate('creator');

      return ev.map(event => transformEvent(event));
    } catch (err) {
      console.log(err);

      throw err;
    }
  },
  createEvent: async args => {
    const { eventInput } = args;
    const { title, description, price, date } = eventInput;

    const event = new Event({
      title,
      description,
      price,
      date: dateToString(date),
      creator: '5ebf2b08434b1b8cea9cc0a4'
    });

    try {
      const result = await event.save();
      const createdEvent = transformEvent(result);
      const userFound = await User.findById('5ebf2b08434b1b8cea9cc0a4');

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
};
