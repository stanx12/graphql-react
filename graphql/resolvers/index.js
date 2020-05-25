import authResolver from './auth';
import eventsResolver from './events';
import bookingResolver from './booking';

export default {
  Query: {
    ...authResolver.Query,
    ...eventsResolver.Query,
    ...bookingResolver.Query
  },
  Mutation: {
    ...authResolver.Mutation,
    ...eventsResolver.Mutation,
    ...bookingResolver.Mutation
  }
};
