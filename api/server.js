/* eslint linebreak-style: ["error", "windows"] */
const express = require('express');
const fs = require('fs');
require('dotenv').config();
const { ApolloServer } = require('apollo-server-express');
const { MongoClient } = require('mongodb');

const url = process.env.DB_URL || 'mongodb+srv://Mongo_14:Mongo_14@freecluster.3p1qg.mongodb.net/inventory?retryWrites=true';

let db;

async function getNextSequence(name) {
  const result = await db.collection('counters').findOneAndUpdate(
    { _id: name },
    { $inc: { current: 1 } },
    { returnOriginal: false },
  );
  return result.value.current;
}

async function productList() {
  const products = await db.collection('products').find({}).toArray();
  return products;
}

async function productAdd(_, { product }) {
  const newProduct = { ...product };
  newProduct.id = await getNextSequence('products');
  const result = await db.collection('products').insertOne(newProduct);
  const savedProduct = await db.collection('products').findOne({ _id: result.insertedId });
  return savedProduct;
}

const resolvers = {
  Query: {
    productList,
  },
  Mutation: {
    productAdd,
  },
};


async function connectToDb() {
  const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  console.log('Connected to MongoDB at', url);
  db = client.db();
}

const server = new ApolloServer({
  typeDefs: fs.readFileSync('schema.graphql', 'utf-8'),
  resolvers,
});

const app = express();

const pageServerMiddleWare = express.static('public');
app.use('/', pageServerMiddleWare);

server.applyMiddleware({ app, path: '/graphql' });

const port = process.env.API_SERVER_PORT || 3000;

(async function start() {
  try {
    await connectToDb();
    app.listen(port, () => {
      console.log(`API server started on port ${port}`);
    });
  } catch (err) {
    console.log('ERROR:', err);
  }
}());
