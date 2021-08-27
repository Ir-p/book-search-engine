const { User } = require('../models');
const { AuthError } = require('apollo-server-express');
const { utils } = require('../utils/auth.js')

const resolvers = {
  Query: {
    me: async () => {
      return User.find();
    },

    User: async (parent, { userId }) => {
      return User.findOne({ _id: userId });
    },
  },

  Mutation: {
    addUser: async (parent, { username }) => {
      const user = await User.create({ username });
      const token = utils(user);
      return { user, token }
    },

    login: async (parent, { email, password }) => {
        const user = await User.findOne({email});
        if (!user){ 
            throw new AuthError("User email is not found.")
        }
        const userPwd = await user.isCorrectPassword(password)
        if (!userPwd){
            throw new AuthError("User password is invalid.")
        }
        const token = signToken(user)
        return { user, token }
    }, 

    saveBook: async (parent, {bookData}, context) => {
        if (context.user) {
            const userUpdate = await User.findByIdAndUpdate(
                { _id: context.user._id},
                {
                    $push: {savedBooks: bookData},
                },
                {
                    new: true,
                }
            )
            return userUpdate
        }
        throw new AuthError("Login to save books")
    },

    removeBook: async (parent, {bookData}, context) => {
        if (context.user) {
            const userUpdate = await User.findByIdAndUpdate(
                { _id: context.user._id},
                {
                    $pull: {savedBooks: bookData},
                },
                {
                    new: true,
                }
            )
            return userUpdate
        }
        throw new AuthError("Login to save books")
    }
  },
};

module.exports = resolvers;