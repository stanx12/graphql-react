/* eslint-disable no-underscore-dangle */
import bcrypt from 'bcryptjs';

import { User } from '../../models';

export default {
  Query: {},
  Mutation: {
    createUser: async (_, { userInput }) => {
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
  }
};
