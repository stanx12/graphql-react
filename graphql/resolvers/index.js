import authResolver from './auth';
import eventsResolver from './events';
import bookingResolver from './booking';

export default { ...authResolver, ...eventsResolver, ...bookingResolver };
