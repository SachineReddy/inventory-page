/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint linebreak-style: ["error", "windows"] */

import React from 'react';
import {
  Panel,
} from 'react-bootstrap';
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
      <Panel>
        <Panel.Heading>
          <Panel.Title>{`Product name : ${product.name}`}</Panel.Title>
        </Panel.Heading>
        <Panel.Body>
          <img src={product.image} alt="Image not available" style={{ maxWidth: '100vw' }} />
        </Panel.Body>
      </Panel>
    );
  }
}
