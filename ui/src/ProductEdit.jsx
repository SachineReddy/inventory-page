/* eslint-disable object-curly-newline */
/* eslint linebreak-style: ["error", "windows"] */

import React from 'react';
import { Link } from 'react-router-dom';
import {
  Col, Panel, Form, FormControl, FormGroup, ControlLabel, ButtonToolbar, Button,
} from 'react-bootstrap';
import graphQLFetch from './graphQLFetch.js';
import NumInput from './NumInput.jsx';
import TextInput from './TextInput.jsx';
import Toast from './Toast.jsx';

export default class ProductEdit extends React.Component {
  constructor() {
    super();
    this.state = {
      product: {},
      toastVisible: false,
      toastMessage: '',
      toastType: 'success',
    };
    this.onChange = this.onChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.showSuccess = this.showSuccess.bind(this);
    this.dismissToast = this.dismissToast.bind(this);
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
      this.showSuccess('Updated product successfully');
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

  showSuccess(message) {
    this.setState({
      toastVisible: true, toastMessage: message, toastType: 'success',
    });
  }

  dismissToast() {
    this.setState({ toastVisible: false });
  }

  render() {
    const { product: { id } } = this.state;
    const { toastVisible, toastMessage, toastType } = this.state;
    const { match: { params: { id: propsId } } } = this.props;
    const propsIdInt = parseInt(propsId, 10);
    if (id == null) {
      if (propsId != null) {
        return (
          <Panel>
            <Panel.Heading>
              <Panel.Title>{`Product with ID ${propsId} not found.`}</Panel.Title>
            </Panel.Heading>
            <Panel.Body />
            <Panel.Footer>
              <Link to={`/edit/${propsIdInt - 1}`}>Prev</Link>
              {' | '}
              <Link to={`/edit/${propsIdInt + 1}`}>Next</Link>
            </Panel.Footer>
          </Panel>
        );
      }
      return null;
    }

    const { product: { category, name, price, image } } = this.state;

    return (
      <Panel>
        <Panel.Heading>
          <Panel.Title>{`Editing product: ${id}`}</Panel.Title>
        </Panel.Heading>
        <Panel.Body>
          <Form horizontal onSubmit={this.handleSubmit}>
            <FormGroup>
              <Col componentClass={ControlLabel} sm={2}>Name :</Col>
              <Col sm={8}>
                <FormControl
                  componentClass={TextInput}
                  name="name"
                  value={name}
                  onChange={this.onChange}
                  key={id}
                  required
                />
              </Col>
            </FormGroup>
            <FormGroup>
              <Col componentClass={ControlLabel} sm={2}>Category :</Col>
              <Col sm={8}>
                <FormControl
                  componentClass="select"
                  name="category"
                  value={category}
                  onChange={this.onChange}
                >
                  <option value="Shirts">Shirts</option>
                  <option value="Jeans">Jeans</option>
                  <option value="Jackets">Jackets</option>
                  <option value="Sweaters">Sweaters</option>
                  <option value="Accessories">Accessories</option>
                </FormControl>
              </Col>

            </FormGroup>
            <FormGroup>
              <Col componentClass={ControlLabel} sm={2}>Price :</Col>
              <Col sm={8}>
                <FormControl
                  componentClass={NumInput}
                  name="price"
                  value={price}
                  onChange={this.onChange}
                  key={id}
                  required
                />
              </Col>
            </FormGroup>
            <FormGroup>
              <Col componentClass={ControlLabel} sm={2}>Image :</Col>
              <Col sm={8}>
                <FormControl
                  componentClass={TextInput}
                  value={image}
                  onChange={this.onChange}
                  key={id}
                />
              </Col>
            </FormGroup>
            <FormGroup>
              <Col smOffset={3} sm={6}>
                <ButtonToolbar>
                  <Button bsStyle="primary" type="submit">Submit</Button>
                </ButtonToolbar>
              </Col>
            </FormGroup>
          </Form>
        </Panel.Body>
        <Panel.Footer>
          <Link to={`/edit/${id - 1}`}>Prev</Link>
          {' | '}
          <Link to={`/edit/${id + 1}`}>Next</Link>
        </Panel.Footer>
        <Toast
          showing={toastVisible}
          onDismiss={this.dismissToast}
          bsStyle={toastType}
        >
          {toastMessage}
        </Toast>
      </Panel>

    );
  }
}
