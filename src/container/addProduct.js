import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Container } from 'react-bootstrap';
import { BASE_URL } from '../utils/constants';
import NavbarComponent from '../components/navbar';

const AddProduct = () => {
  const [productData, setProductData] = useState({
    title: '',
    price: 0,
    description: '',
    category: '',
    image: '',
    rating: {
      rate: 0,
      count: 0,
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(BASE_URL, productData);
      console.log('Product added:', response.data);
      setProductData({
        title: '',
        price: 0,
        description: '',
        category: '',
        image: '',
        rating: {
          rate: 0,
          count: 0,
        },
      });
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setProductData((prevData) => ({
        ...prevData,
        [parent]: {
          ...prevData[parent],
          [child]: value,
        },
      }));
    } else {
      setProductData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };
  
  return (
    <>
    <NavbarComponent />
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <div style={{ maxWidth: '600px', width: '100%', border: '2px solid black', borderRadius: '25px', padding: '12px' }}>
        <h2 className="text-center mb-4">Add Product</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="title">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={productData.title}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="price">
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="number"
              name="price"
              value={productData.price}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="description">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              value={productData.description}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="category">
            <Form.Label>Category</Form.Label>
            <Form.Control
              type="text"
              name="category"
              value={productData.category}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="image">
            <Form.Label>Image URL</Form.Label>
            <Form.Control
              type="text"
              name="image"
              value={productData.image}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="rating.rate">
            <Form.Label>Rating</Form.Label>
            <Form.Control
              type="number"
              name="rating.rate"
              value={productData.rating.rate}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="rating.count">
            <Form.Label>Rating Count</Form.Label>
            <Form.Control
              type="number"
              name="rating.count"
              value={productData.rating.count}
              onChange={handleChange}
            />
          </Form.Group>
          <Button variant="primary" type="submit" className="w-100">
            Add Product
          </Button>
        </Form>
      </div>
    </Container>
    </>
  );
};

export default AddProduct;
