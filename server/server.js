const express = require('express');
const fs = require('fs');
const { ApolloServer } = require('apollo-server-express');

const productsDB = [
    {
        id : 1,
        name : 'Blue Shirt',
        price : 16.99,
        category : 'Shirts',
        image : 'https://www.istockphoto.com/photo/smiling-young-man-pointing-down-gm996927722-269751810'
    }
]

const resolvers = {
    Query: {
        productList,
        product,
    },
    Mutation: {
        productAdd
    }
}

function product(_, {id}){
    return productsDB.find(product => product.id === id);
}

function productList(){
    return productsDB;
}

function productAdd(_, { product }) {
    product.id = productsDB.length+1;
    productsDB.push(product);
    return product;
}

const server = new ApolloServer({
    typeDefs : fs.readFileSync('./server/schema.graphql', 'utf-8'),
    resolvers
})

const app = express();

const pageServerMiddleWare = express.static('public');
app.use('/', pageServerMiddleWare);

server.applyMiddleware({app, path: '/graphql'});

app.listen(3000, () => {
    console.log("Server started on port 3000 ...");
})