/* eslint linebreak-style: ["error", "windows"] */

import React from 'react';

import ProductTable from './ProductTable.jsx';
import ProductAdd from './ProductAdd.jsx';
import graphQLFetch from './graphQLFetch.js';

export default class ProductList extends React.Component {
  constructor() {
    super();
    this.state = { products: [] };
    this.createProduct = this.createProduct.bind(this);
    this.deleteProduct = this.deleteProduct.bind(this);
  }

  componentDidMount() {
    this.loadData();
  }

  async loadData() {
    const query = `query {
              productList {
                  id name category price image
              }
          }`;

    const data = await graphQLFetch(query);
    if (data) {
      this.setState({ products: data.productList });
    }
  }

  async createProduct(product) {
    const query = `mutation productAdd($product : ProductInputs!){
              productAdd( product : $product) {
                  id
              }
          }`;
    const data = await graphQLFetch(query, { product });
    if (data) {
      this.loadData();
    }
  }

  async deleteProduct(id) {
    const query = `mutation productDelete($id: Int!) {
      productDelete(id: $id)
    }`;
    await graphQLFetch(query, { id });
    this.loadData();
  }

  render() {
    const { products } = this.state;
    return (
      <React.Fragment>
        <h1>My Company Inventory</h1>
        <h3>Showing all available products</h3>
        <hr />
        <ProductTable products={products} deleteProduct={this.deleteProduct} />
        <br />
        <h3>Add a new product to inventory</h3>
        <hr />
        <ProductAdd createProduct={this.createProduct} />
      </React.Fragment>

    );
  }
}
