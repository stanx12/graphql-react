/* eslint-disable no-underscore-dangle */

import { Event, User } from '../../models';
import { dateToString } from '../../utils';

export const transformEvent = event => ({
  ...event._doc,
  _id: event.id,
  date: dateToString(event._doc.date),
  // eslint-disable-next-line no-use-before-define
  creator: user.bind(this, event.creator)
});

const events = async eventsId => {
  try {
    const foundEvents = await Event.find({ _id: { $in: eventsId } });

    return foundEvents.map(e => transformEvent(e));
  } catch (err) {
    console.log(err);

    throw err;
  }
};

const user = async id => {
  try {
    const foundUser = await User.findById(id);

    console.log({ ...foundUser._doc });

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

const singleEvent = async eventId => {
  try {
    const foundEvent = await Event.findById(eventId);

    return transformEvent(foundEvent);
  } catch (error) {
    console.log(error);

    throw error;
  }
};

export const transformBooking = booking => ({
  ...booking._doc,
  _id: booking.id,
  user: user.bind(this, booking._doc.user),
  event: singleEvent.bind(this, booking._doc.event),
  createdAt: dateToString(booking._doc.createdAt),
  updatedAt: dateToString(booking._doc.updatedAt)
});
