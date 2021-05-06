/* eslint-disable react/jsx-one-expression-per-line */
/* eslint linebreak-style: ["error", "windows"] */

import React from 'react';

import ProductTable from './ProductTable.jsx';
import ProductAdd from './ProductAdd.jsx';
import graphQLFetch from './graphQLFetch.js';

export default class ProductList extends React.Component {
  constructor() {
    super();
    this.state = { products: [], productTotal: 0 };
    this.createProduct = this.createProduct.bind(this);
    this.deleteProduct = this.deleteProduct.bind(this);
  }

  componentDidMount() {
    this.loadData();
  }

  async loadData() {
    this.loadCount();
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

  async loadCount() {
    const query = `query {
              productCounts 
          }`;

    const data = await graphQLFetch(query);
    if (data) {
      this.setState({ productTotal: data.productCounts });
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
    const { products, productTotal } = this.state;
    return (
      <React.Fragment>
        <h4>Showing { productTotal } available products</h4>
        <ProductTable products={products} deleteProduct={this.deleteProduct} />
        <ProductAdd createProduct={this.createProduct} />
      </React.Fragment>

    );
  }
}
