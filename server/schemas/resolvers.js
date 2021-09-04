const { User } = require("../models");
const { AuthenticationError } = require("apollo-server-express");
const { signToken } = require("../utils/auth.js");

const resolvers = {
  Query: {
    // By adding context to our query, we can retrieve the logged in user without specifically searching for them
    me: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id });
      }
      throw new AuthenticationError("You need to be logged in!");
    },
  },

  Mutation: {
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);

      return { token, user };
    },

    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError("User email is not found.");
      }
      const userPwd = await user.isCorrectPassword(password);
      if (!userPwd) {
        throw new AuthenticationError("User password is invalid.");
      }
      const token = signToken(user);
      return { user, token };
    },

    saveBook: async (parent, { bookData }, context) => {
      if (context.user) {
        const userUpdate = await User.findByIdAndUpdate(
          { _id: context.user._id },
          {
            $push: { savedBooks: bookData },
          },
          { new: true }
        );
        return userUpdate;
      }
      throw new AuthenticationError("Login to save books");
    },

    removeBook: async (parent, { bookId }, context) => {
      if (context.user) {
        const userUpdate = await User.findByIdAndUpdate(
          { _id: context.user._id },
          {
            $pull: { savedBooks: bookId },
          },
          { new: true });
        return userUpdate;
      }
      throw new AuthenticationError("Login to save books");
    },
  },
};

module.exports = resolvers;
