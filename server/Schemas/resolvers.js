const {User, Book} = require('../models');
const {AuthenticationError} = require('apollo-server-express');
const {signToken} = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if(context.user){
                const userData = await User.findOne({_id: context.user._id})
                    .select('-__v -password')
                return userData;
            }
            throw new AuthenticationError('not logged in');
        }
    },
    Mutation: {
        addUser: async (parent, args) => {
            console.log('I got here');
            const user = await User.create(args);
            const token = signToken(user);
            console.log(user);
            console.log(token);
            return {token, user};
        },
        login: async(parent, {email, password}) => {
            const user = await User.findOne({email});
            
            if(!user){
                throw new AuthenticationError('Incorrect credentials')
            }
            const correctPw = await user.isCorrectPassword(password);
            if(!correctPw){
                throw new AuthenticationError('Incorrect credentials')
            }
            const token = signToken(user);
            return{token, user}
        },
        saveBook: async (parent, args, context) => {
            if(context.user){
                console.log(context.user);
                // const book = await Book.create({args});
                const user =await User.findByIdAndUpdate(
                    {_id: context.user._id},
                    {$push: {savedBooks: args}},
                    {new:true}
                )
                return user;
            }
            throw new AuthenticationError('You need to be logged in to add a book!');
        },
        removeBook : async (parent, args, context) => {
            if(context.user){
                User.findByIdAndUpdate(
                    {_id: context.user._id},
                    {$pull: {savedBooks: {bookId: args.bookId}}},
                    {new: true}
                )
            }
        }
    }
}

module.exports = resolvers;