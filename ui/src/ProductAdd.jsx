/* eslint-disable react/no-array-index-key */
/* eslint linebreak-style: ["error", "windows"] */
/* eslint-disable max-len */

import React from 'react';
import {
  Col, Panel, Form, FormControl, FormGroup, ControlLabel, ButtonToolbar, Button,
} from 'react-bootstrap';

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
      <Panel>
        <Panel.Heading>
          <Panel.Title>Add a new product to inventory</Panel.Title>
        </Panel.Heading>
        <Panel.Body>
          <Form horizontal name="productAdd" onSubmit={this.handleSubmit}>
            <FormGroup>
              <Col componentClass={ControlLabel} sm={2}>Category</Col>
              <Col sm={3}>
                <FormControl
                  componentClass="select"
                  name="category"
                  id="category"
                  defaultValue=""
                  required
                >
                  <option value="" disabled>Choose category</option>
                  {categories
                    .map((category, index) => <option key={index + 1} value={index + 1}>{category}</option>)}
                </FormControl>
              </Col>
              <Col componentClass={ControlLabel} sm={2}>Price Per Unit:</Col>
              <Col sm={3}>
                <FormControl
                  componentClass="input"
                  name="price"
                  value={priceValue}
                  id="price"
                  onChange={e => this.setState({ priceValue: e.target.value })}
                />
              </Col>
            </FormGroup>
            <FormGroup>
              <Col componentClass={ControlLabel} sm={2}>Product Name:</Col>
              <Col sm={3}>
                <FormControl
                  componentClass="input"
                  type="text"
                  name="productName"
                  id="productName"
                  required
                />
              </Col>
              <Col componentClass={ControlLabel} sm={2}>Image URL:</Col>
              <Col sm={3}>
                <FormControl
                  componentClass="input"
                  type="url"
                  name="image"
                  id="image"
                />
              </Col>
            </FormGroup>
            <FormGroup>
              <Col smOffset={3} sm={6}>
                <ButtonToolbar>
                  <Button bsStyle="primary" type="submit">Add Product</Button>
                </ButtonToolbar>
              </Col>
            </FormGroup>
          </Form>
        </Panel.Body>
      </Panel>

    );
  }
}
