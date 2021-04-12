/* eslint-disable react/prefer-stateless-function */
/* eslint linebreak-style: ["error", "windows"] */

import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import {
  Button, Glyphicon, Tooltip, OverlayTrigger, Table,
} from 'react-bootstrap';

import { Link, withRouter } from 'react-router-dom';

const ProductRow = withRouter(({ product, deleteProduct }) => {
  const editTooltip = (
    <Tooltip id="close-tooltip" placement="top">Edit Product</Tooltip>
  );
  const deleteTooltip = (
    <Tooltip id="delete-tooltip" placement="top">Delete Product</Tooltip>
  );
  return (
    <React.Fragment>
      <tr>
        <td>{product.name}</td>
        <td>
          $
          {product.price}
        </td>
        <td>{product.category}</td>
        <td><Link to={`/image/view/${product.id}`}>View</Link></td>
        <td>
          <LinkContainer to={`/edit/${product.id}`}>
            <OverlayTrigger delayShow={1000} overlay={editTooltip}>
              <Button bsSize="xsmall">
                <Glyphicon glyph="edit" />
              </Button>
            </OverlayTrigger>
          </LinkContainer>
          {' '}
          <OverlayTrigger delayShow={1000} overlay={deleteTooltip}>
            <Button bsSize="xsmall" type="button" onClick={() => { deleteProduct(product.id); }}>
              <Glyphicon glyph="trash" />
            </Button>
          </OverlayTrigger>
        </td>
      </tr>
    </React.Fragment>
  );
});

export default function ProductTable({ products, deleteProduct }) {
  const productRows = products.map(product => (
    <ProductRow key={product.id} product={product} deleteProduct={deleteProduct} />
  ));

  return (
    <Table bordered condensed hover responsive>
      <thead>
        <tr>
          <th>Product Name</th>
          <th>Price</th>
          <th>Category</th>
          <th>Image</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        { productRows }
      </tbody>
    </Table>
  );
}
