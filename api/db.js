/* eslint linebreak-style: ["error", "windows"] */
require('dotenv').config();
const { MongoClient } = require('mongodb');

let db;

async function connectToDb() {
  const url = process.env.DB_URL || 'mongodb+srv://Mongo_14:Mongo_14@freecluster.3p1qg.mongodb.net/inventory?retryWrites=true';
  const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  console.log('Connected to MongoDB at', url);
  db = client.db();
}

async function getNextSequence(name) {
  const result = await db.collection('counters').findOneAndUpdate(
    { _id: name },
    { $inc: { current: 1 } },
    { returnOriginal: false },
  );
  return result.value.current;
}

function getDb() {
  return db;
}

module.exports = { connectToDb, getNextSequence, getDb };
