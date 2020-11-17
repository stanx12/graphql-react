/* eslint-disable no-underscore-dangle */
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { User } from '../../models';
import isAuth from '../../middleware/is-auth';

export default {
  Query: {
    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new Error('Invalid credentials');
      }

      const isEqual = await bcrypt.compare(password, user.password);
      if (!isEqual) {
        throw new Error('Invalid credentials');
      }

      const token = await jwt.sign({ userId: user.id, email }, 'testString', {
        expiresIn: '1h'
      });

      return { userId: user.id, token, tokenExpiration: 1 };
    }
  },
  Mutation: {
    createUser: async (_, { userInput }, context) => {
      if (!isAuth(context)) {
        return null;
      }

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
