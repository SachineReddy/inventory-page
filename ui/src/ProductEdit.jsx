/* eslint-disable object-curly-newline */
/* eslint linebreak-style: ["error", "windows"] */

import React from 'react';
import { Link } from 'react-router-dom';
import graphQLFetch from './graphQLFetch.js';
import NumInput from './NumInput.jsx';
import TextInput from './TextInput.jsx';

export default class ProductEdit extends React.Component {
  constructor() {
    super();
    this.state = { product: {} };
    this.onChange = this.onChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.loadData();
  }

  componentDidUpdate(prevProps) {
    const { match: { params: { id: prevId } } } = prevProps;
    const { match: { params: { id } } } = this.props;
    if (id !== prevId) {
      this.loadData();
    }
  }

  onChange(event, naturalValue) {
    const { name, value: textValue } = event.target;
    const value = naturalValue === undefined ? textValue : naturalValue;
    this.setState(prevState => ({
      product: { ...prevState.product, [name]: value },
    }));
  }

  async handleSubmit(e) {
    e.preventDefault();
    const { product } = this.state;
    const query = `mutation productUpdate(
        $id: Int!
        $changes: ProductUpdateInputs!
    ) {
        productUpdate(
            id: $id
            changes: $changes
    ) {
        id        
        name
        category
        price
        image
    }
    }`;
    const { id, ...changes } = product;
    const data = await graphQLFetch(query, { changes, id });
    if (data) {
      this.setState({ product: data.productUpdate });
      alert('Updated Product Successfully'); // eslint-disable-line no-alert
    }
  }


  async loadData() {
    const query = `query product($id: Int!) {
      product(id: $id) {
        id name category price image
      }
    }`;
    const { match: { params: { id } } } = this.props;
    const data = await graphQLFetch(query, { id });
    this.setState({ product: data ? data.product : {} });
  }

  render() {
    const { product: { id } } = this.state;
    const { match: { params: { id: propsId } } } = this.props;
    const propsIdInt = parseInt(propsId, 10);
    if (id == null) {
      if (propsId != null) {
        return (
          <div>
            <h3>{`Product with ID ${propsId} not found.`}</h3>
            <Link to={`/edit/${propsIdInt - 1}`}>Prev</Link>
            {' | '}
            <Link to={`/edit/${propsIdInt + 1}`}>Next</Link>
          </div>
        );
      }
      return null;
    }

    const { product: { category, name, price, image } } = this.state;

    return (
      <form onSubmit={this.handleSubmit}>
        <h1>{`Editing product: ${id}`}</h1>
        <table>
          <tbody>
            <tr>
              <td>Name:</td>
              <td>
                <TextInput name="name" value={name} onChange={this.onChange} key={id} />
              </td>
            </tr>
            <tr>
              <td>Category:</td>
              <td>
                <select name="category" value={category} onChange={this.onChange}>
                  <option value="Shirts">Shirts</option>
                  <option value="Jeans">Jeans</option>
                  <option value="Jackets">Jackets</option>
                  <option value="Sweaters">Sweaters</option>
                  <option value="Accessories">Accessories</option>
                </select>
              </td>
            </tr>
            <tr>
              <td>Price:</td>
              <td>
                <NumInput name="price" value={price} onChange={this.onChange} key={id} />
              </td>
            </tr>
            <tr>
              <td>Image:</td>
              <td>
                <TextInput name="image" value={image} onChange={this.onChange} key={id} />
              </td>
            </tr>
            <tr>
              <td />
              <td>
                <button type="submit">Submit</button>
              </td>
            </tr>
          </tbody>
        </table>
        <Link to={`/edit/${id - 1}`}>Prev</Link>
        {' | '}
        <Link to={`/edit/${id + 1}`}>Next</Link>
      </form>
    );
  }
}
