import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  incrementQuantity,
  decrementQuantity,
  removeItem,
} from '../store/cartSlice';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';

const Cart = () => {
  const cartItems = useSelector((state) => state.cart.cart);
  const dispatch = useDispatch();

  const calculateSubTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const calculateTaxes = () => {
    const taxes = calculateSubTotal() * 0.18;
    return taxes;
  };

  const calculateTotalAmount = () => {
    return calculateSubTotal() + calculateTaxes();
  };

  return (
    <Container>
      <h2>Cart Items</h2>
      <Link to="/" style={{ textDecoration: 'none' }}>
        <Button variant="primary">HOME</Button>
      </Link>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
           <Row xs={1} sm={2} md={3} lg={4} className="g-4">
            {cartItems.map((item) => (
              <Col key={item.id}>
                <Card
                  style={{ border: '1px solid #dee2e6', marginBottom: '10px' }}
                >
                  <Card.Body className="d-flex flex-column">
                    <Card.Title className='text-truncate'>{item.title}</Card.Title>
                    <Card.Img
                      src={item.image}
                      alt="error"
                      style={{
                        width: '150px',
                        height: '150px',
                        marginBottom: '10px',
                      }}
                    />
                    <Card.Text className='h5'>Price: {item.price} ₹</Card.Text>
                    <Card.Text className='h4'>Total Price: {(item.price * item.quantity).toFixed(1)}</Card.Text>
                    <div className="d-flex align-items-center">
                      <Button
                        variant="secondary"
                        onClick={() =>dispatch(decrementQuantity(item.id))}
                      >
                        -
                      </Button>
                      <span style={{padding:"6px"}}>{item.quantity}</span>
                      <Button
                        variant="secondary"
                        onClick={() => dispatch(incrementQuantity(item.id))}
                      >
                        +
                      </Button>
                      <div style={{width: "100%",display: "flex",justifyContent:"end"}}>
                      <Button
                        variant="danger"
                        onClick={() => dispatch(removeItem(item.id))}
                      >
                        Remove
                      </Button>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </>
      )}

      {cartItems.length > 0 && (
        <div
          className="mt-4"
          style={{
            background: '#e6fff2',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <h3>Cart-Total</h3>
          <h6>Sub Total: ₹{calculateSubTotal().toFixed(1)}</h6>
          <h6>Taxes: ₹{calculateTaxes().toFixed(1)}</h6>
          <h2>Total Amount: ₹{calculateTotalAmount().toFixed(1)}</h2>
        </div>
      )}
      <hr></hr>
    </Container>
  );
};

export default Cart;
