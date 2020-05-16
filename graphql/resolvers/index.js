/* eslint-disable no-underscore-dangle */
import bcrypt from 'bcryptjs';

import Event from '../../models/event';
import User from '../../models/user';

const events = async eventsId => {
  try {
    const foundEvents = await Event.find({ _id: { $in: eventsId } });

    return foundEvents.map(e => ({
      ...e._doc,
      _id: e.id,
      date: new Date(e._doc.date).toISOString(),
      creator: user.bind(this, e.creator)
    }));
  } catch (err) {
    console.log(err);

    throw err;
  }
};

const user = async id => {
  try {
    const foundUser = await User.findById(id);

    return {
      ...foundUser._doc,
      _id: foundUser.id,
      createdEvents: events.bind(this, foundUser._doc.createdEvents)
    };
  } catch (err) {
    console.log(err);

    throw err;
  }
};

export default {
  events: async () => {
    try {
      const ev = await Event.find().populate('creator');

      return ev.map(event => ({
        ...event._doc,
        _id: event.id,
        date: new Date(event._doc.date).toISOString(),
        creator: user.bind(this, event._doc.creator)
      }));
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
      date: new Date(date),
      creator: '5ebf2b08434b1b8cea9cc0a4'
    });

    try {
      const result = await event.save();
      const createdEvent = {
        ...result._doc,
        _id: result.id,
        creator: user.bind(this, result._doc.creator)
      };
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
  },
  createUser: async args => {
    const { userInput } = args;
    const { email, password } = userInput;

    try {
      const foundUser = await User.findOne({ email });
      if (foundUser) {
        throw new Error('User exists already');
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const savedUser = new User({
        email,
        password: hashedPassword
      });

      const result = await savedUser.save();

      return { ...result._doc, _id: result.id, password: null };
    } catch (err) {
      console.log(err);

      throw err;
    }
  }
};
