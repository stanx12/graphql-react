/* eslint-disable no-underscore-dangle */
import { Booking, Event, User } from '../../models';

import { transformEvent, transformBooking } from './merge';

export default {
  bookings: async () => {
    try {
      const bookings = await Booking.find();

      return bookings.map(b => transformBooking(b));
    } catch (error) {
      console.log(error);

      throw error;
    }
  },
  bookEvent: async ({ eventId }) => {
    try {
      const fetchedEvent = await Event.findOne({ _id: eventId });
      const fetchedUser = await User.findById('5ebf2b08434b1b8cea9cc0a4');

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
  cancelBooking: async ({ bookingId }) => {
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
};
