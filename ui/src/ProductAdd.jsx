/* eslint-disable react/no-array-index-key */
/* eslint linebreak-style: ["error", "windows"] */
/* eslint-disable max-len */

import React from 'react';

export default class ProductAdd extends React.Component {
  constructor() {
    super();
    this.state = { priceValue: '$' };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    const form = document.forms.productAdd;
    const { category } = form;
    const product = {
      category: category.options[category.selectedIndex].text,
      price: form.price.value.replace('$', ''),
      name: form.productName.value,
      image: form.image.value,
    };
    const { createProduct } = this.props;
    createProduct(product);
    form.category.selectedIndex = 0;
    this.setState({ priceValue: '$' });
    form.productName.value = '';
    form.image.value = '';
  }

  render() {
    const categories = ['Shirts', 'Jeans', 'Jackets', 'Sweaters', 'Accessories'];
    const { priceValue } = this.state;
    return (
      <form name="productAdd" onSubmit={this.handleSubmit}>
        <table className="product-add-table">
          <tbody>
            <tr>
              <td>
                <label htmlFor="category">
                  <h4>Category</h4>
                  <select name="category" id="category" defaultValue="" required>
                    <option value="" disabled>Choose category</option>
                    {categories
                      .map((category, index) => <option key={index + 1} value={index + 1}>{category}</option>)}
                  </select>
                </label>
              </td>
              <td>
                <label htmlFor="price">
                  <h4>Price Per Unit</h4>
                  <input
                    name="price"
                    id="price"
                    value={priceValue}
                    onChange={e => this.setState({ priceValue: e.target.value })}
                  />
                </label>
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="productName">
                  <h4>Product Name</h4>
                  <input type="text" name="productName" id="productName" placeholder="Name" required />
                </label>
              </td>
              <td>
                <label htmlFor="image">
                  <h4>Image URL</h4>
                  <input type="url" name="image" id="image" placeholder="Image URL" />
                </label>
              </td>
            </tr>
            <tr>
              <td>
                <br />
                <button type="submit"><b>Add product</b></button>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    );
  }
}
