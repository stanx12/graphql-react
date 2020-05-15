/* eslint-disable no-underscore-dangle */
import bcrypt from 'bcryptjs';

import Event from '../../models/event';
import User from '../../models/user';

const events = eventsId => {
  return Event.find({ _id: { $in: eventsId } })
    .then(foundEvents => {
      return foundEvents.map(e => {
        return {
          ...e._doc,
          _id: e.id,
          date: new Date(e._doc.date).toISOString(),
          creator: user.bind(this, e.creator)
        };
      });
    })
    .catch(err => console.log(err));
};

const user = id => {
  return User.findById(id)
    .then(foundUser => ({
      ...foundUser._doc,
      _id: foundUser.id,
      createdEvents: events.bind(this, foundUser._doc.createdEvents)
    }))
    .catch(err => console.log(err));
};

export default {
  events: () => {
    return Event.find()
      .populate('creator')
      .then(ev => {
        return ev.map(event => ({
          ...event._doc,
          _id: event.id,
          date: new Date(event._doc.date).toISOString(),
          creator: user.bind(this, event._doc.creator)
        }));
      })
      .catch(err => {
        console.log(err);

        throw err;
      });
  },
  createEvent: args => {
    const { eventInput } = args;
    const { title, description, price, date } = eventInput;

    const event = new Event({
      title,
      description,
      price,
      date: new Date(date),
      creator: '5ebdd93a3dc4ee84074913ad'
    });
    let createdEvent;

    return event
      .save()
      .then(result => {
        createdEvent = {
          ...result._doc,
          _id: result.id,
          creator: user.bind(this, result._doc.creator)
        };
        return User.findById('5ebdd93a3dc4ee84074913ad');
      })
      .then(u => {
        if (!u) {
          throw new Error('User not found');
        }

        u.createdEvents.push(event);
        return u.save();
      })
      .then(() => {
        return createdEvent;
      })
      .catch(err => {
        console.log(err);

        throw err;
      });
  },
  createUser: args => {
    const { userInput } = args;
    const { email, password } = userInput;

    return User.findOne({ email })
      .then(u => {
        if (u) {
          throw new Error('User exists already');
        }

        return bcrypt.hash(password, 12);
      })
      .then(hashedPassword => {
        const u = new User({
          email,
          password: hashedPassword
        });

        return u.save();
      })
      .then(result => {
        return { ...result._doc, _id: result._id, password: null };
      })
      .catch(err => {
        throw err;
      });
  }
};
