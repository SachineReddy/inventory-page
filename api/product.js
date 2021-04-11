/* eslint linebreak-style: ["error", "windows"] */

const { UserInputError } = require('apollo-server-express');
const { getDb, getNextSequence } = require('./db.js');

async function list() {
  const db = getDb();
  const products = await db.collection('products').find({}).toArray();
  return products;
}

function validate(product) {
  const errors = [];
  if (product.name === null || product.name === '') errors.push('Product name not specified');
  if (product.price === null || product.price === '') errors.push('Product price not specified');
  if (errors.length > 0) {
    throw new UserInputError('Invalid input(s)', { errors });
  }
}

async function add(_, { product }) {
  const db = getDb();

  const newProduct = { ...product };
  newProduct.id = await getNextSequence('products');
  const result = await db.collection('products').insertOne(newProduct);
  const savedProduct = await db.collection('products').findOne({ _id: result.insertedId });
  return savedProduct;
}

async function retrieve(_, { id }) {
  const db = getDb();
  const product = await db.collection('products').findOne({ id });
  return product;
}

async function remove(_, { id }) {
  const db = getDb();
  const product = await db.collection('products').findOne({ id });
  if (!product) return false;
  const result = await db.collection('products').removeOne({ id });
  return result.deletedCount === 1;
}

async function update(_, { id, changes }) {
  const db = getDb();
  if (changes.name || changes.category || changes.price) {
    const product = await db.collection('products').findOne({ id });
    Object.assign(product, changes);
    validate(product);
  }
  await db.collection('products').updateOne({ id }, { $set: changes });
  const savedProduct = await db.collection('products').findOne({ id });
  return savedProduct;
}

module.exports = {
  list, add, retrieve, remove, update,
};
