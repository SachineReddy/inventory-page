/* eslint linebreak-style: ["error", "windows"] */
const fs = require('fs');
require('dotenv').config();
const { ApolloServer } = require('apollo-server-express');

const product = require('./product.js');

const resolvers = {
  Query: {
    productList: product.list,
    product: product.retrieve,
    productCounts: product.counts,
  },
  Mutation: {
    productAdd: product.add,
    productUpdate: product.update,
    productDelete: product.remove,
  },
};

const server = new ApolloServer({
  typeDefs: fs.readFileSync('schema.graphql', 'utf-8'),
  resolvers,
});

function installHandler(app) {
  server.applyMiddleware({ app, path: '/graphql' });
}

module.exports = { installHandler };
