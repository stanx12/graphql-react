/* eslint-disable no-underscore-dangle */
import { Booking, Event, User } from '../../models';
import isAuth from '../../middleware/is-auth';

import { transformEvent, transformBooking } from './merge';

export default {
  Query: {
    bookings: async () => {
      try {
        const bookings = await Booking.find();

        return bookings.map(b => transformBooking(b));
      } catch (error) {
        console.log(error);

        throw error;
      }
    }
  },
  Mutation: {
    bookEvent: async (_, { eventId }, context) => {
      if (!isAuth(context)) {
        return null;
      }

      try {
        const { userId } = context.req;
        const fetchedEvent = await Event.findOne({ _id: eventId });
        const fetchedUser = await User.findById(userId);

        const booking = new Booking({
          user: fetchedUser,
          event: fetchedEvent
        });
        const result = await booking.save();

        return transformBooking(result);
      } catch (error) {
        console.log(error);

        throw error;
      }
    },
    cancelBooking: async (_, { bookingId }, context) => {
      if (!isAuth(context)) {
        return null;
      }

      try {
        const booking = await Booking.findById(bookingId).populate('event');

        const event = transformEvent(booking.event);
        await Booking.deleteOne({ _id: bookingId });

        return event;
      } catch (error) {
        console.log(error);

        throw error;
      }
    }
  }
};
