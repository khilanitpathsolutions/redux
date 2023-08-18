import React from 'react';
import { Badge, Container, Nav, Navbar } from 'react-bootstrap';
import { Cart, Heart } from 'react-bootstrap-icons';
import { useSelector } from 'react-redux';
import logo from '../assets/redux.svg';
import { Link } from 'react-router-dom';

const NavbarComponent = () => {
  const cartItems = useSelector((state) => state.cart.cart); 
  const wishListItems = useSelector((state)=> state.wishlist)

  const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <>
      <Navbar
        bg="primary"
        variant="dark"
        expand="md"
        className="sticky-top"
        style={{ minHeight: '50px', paddingTop: '5px', paddingBottom: '5px' }}
      >
        <Container className="d-flex justify-content-between align-items-center p-2">
          <Navbar.Brand className="d-flex align-items-center">
            <img
              src={logo}
              alt="error"
              style={{ width: '40px', height: '40px', marginRight: '10px' }}
            />
            <span style={{ fontSize: '1.2rem' }}>Redux-Demo</span>
          </Navbar.Brand>
          <Nav className="d-flex align-items-center">
            <Nav.Link
              as={Link}
              to="/cart"
              className="text-decoration-none text-dark d-flex align-items-center"
            >
              <Cart size={24} />
              {totalQuantity > 0 && (
                <Badge bg="danger" className="ms-1">
                  {totalQuantity}
                </Badge>
              )}
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/wishlist"
              className="text-decoration-none text-dark d-flex align-items-center"
            >
              <Heart size={24} />
              {wishListItems.length > 0 && (
                <Badge bg="danger" className="ms-1">
                  {wishListItems.length}
                </Badge>
              )}
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
};

export default NavbarComponent;
