/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint linebreak-style: ["error", "windows"] */

import React from 'react';
import graphQLFetch from './graphQLFetch.js';

export default class ProductImage extends React.Component {
  constructor() {
    super();
    this.state = { product: {} };
  }

  componentDidMount() {
    this.loadData();
  }

  async loadData() {
    const query = `query product($id: Int!) {
        product(id: $id) {                  
          name          
          image
        }
    }`;

    const { match: { params: { id } } } = this.props;
    const data = await graphQLFetch(query, { id });
    const invalidProduct = 'Specified product does not exists';
    this.setState({ product: data ? data.product : { name: invalidProduct } });
  }

  render() {
    const { product } = this.state;
    return (
      <div>
        <br />
        <h2>{`Product name : ${product.name}`}</h2>
        <img src={product.image} alt="Image not available" width="500" height="600" />
      </div>
    );
  }
}
