/* eslint linebreak-style: ["error", "windows"] */
/* eslint "react/react-in-jsx-scope": "off" */
/* globals React ReactDOM */
/* eslint "react/jsx-no-undef": "off" */
/* eslint "react/no-multi-comp": "off" */
/* eslint-disable react/no-array-index-key */
/* eslint-disable max-len */
/* eslint "no-alert": "off" */

// eslint-disable-next-line react/prefer-stateless-function
class ProductRow extends React.Component {
  render() {
    const { product } = this.props;
    return (
      <React.Fragment>
        <tr>
          <td>{product.name}</td>
          <td>
            $
            {product.price}
          </td>
          <td>{product.category}</td>
          <td>
            <a href={product.image} target="_blank" rel="noopener noreferrer">
              View
            </a>
          </td>
        </tr>
      </React.Fragment>
    );
  }
}

// eslint-disable-next-line react/prefer-stateless-function
class ProductTable extends React.Component {
  render() {
    const { products } = this.props;
    const productRows = products.map(product => <ProductRow key={product.id} product={product} />);

    return (
      <table className="bordered-table">
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Price</th>
            <th>Category</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody>
          { productRows }
        </tbody>
      </table>
    );
  }
}

class ProductAdd extends React.Component {
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


async function graphQLFetch(query, variables = {}) {
  try {
    const response = await fetch(window.ENV.UI_API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables }),
    });
    const result = await response.json();
    if (result.errors) {
      const error = result.errors[0];
      alert(`${error.extensions.code}: ${error.message}`);
    }
    return result.data;
  } catch (e) {
    alert(`Error in sending data to server: ${e.message}`);
    return null;
  }
}

class ProductList extends React.Component {
  constructor() {
    super();
    this.state = { products: [] };
    this.createProduct = this.createProduct.bind(this);
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

  render() {
    const { products } = this.state;
    return (
      <React.Fragment>
        <h1>My Company Inventory</h1>
        <h3>Showing all available products</h3>
        <hr />
        <ProductTable products={products} />
        <br />
        <h3>Add a new product to inventory</h3>
        <hr />
        <ProductAdd createProduct={this.createProduct} />
      </React.Fragment>

    );
  }
}

ReactDOM.render(<ProductList />, document.getElementById('inventory'));