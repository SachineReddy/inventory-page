/* eslint-disable react/prefer-stateless-function */
/* eslint linebreak-style: ["error", "windows"] */

import React from 'react';

import { Link, withRouter } from 'react-router-dom';

const ProductRow = withRouter(({ product, deleteProduct }) => (
  <React.Fragment>
    <tr>
      <td>{product.name}</td>
      <td>
        $
        {product.price}
      </td>
      <td>{product.category}</td>
      <td><Link to={`/image/view/${product.id}`}>View</Link></td>
      <td><Link to={`/edit/${product.id}`}>Edit</Link></td>
      <td><button type="button" onClick={() => { deleteProduct(product.id); }}>Delete</button></td>
    </tr>
  </React.Fragment>
));

export default function ProductTable({ products, deleteProduct }) {
  const productRows = products.map(product => (
    <ProductRow key={product.id} product={product} deleteProduct={deleteProduct} />
  ));

  return (
    <table className="bordered-table">
      <thead>
        <tr>
          <th>Product Name</th>
          <th>Price</th>
          <th>Category</th>
          <th>Image</th>
          <th>Modify</th>
          <th>Delete</th>
        </tr>
      </thead>
      <tbody>
        { productRows }
      </tbody>
    </table>
  );
}
