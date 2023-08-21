import React from 'react';
import { Badge, Container, Nav, Navbar } from 'react-bootstrap';
import { Cart, Heart, BoxArrowRight, PersonFill } from 'react-bootstrap-icons';
import { useSelector } from 'react-redux';
import logo from '../assets/redux.svg';
import { Link } from 'react-router-dom';
import { logout } from '../store/userSlice';
import { useDispatch } from 'react-redux';

const NavbarComponent = () => {
  const dispatch = useDispatch();

  const cartItems = useSelector((state) => state.cart.cart);
  const wishListItems = useSelector((state) => state.wishlist);

  const totalUniqueItems = cartItems.length;

  const handleLogout = () => {
    dispatch(logout());
  };

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
            <span style={{ fontSize: '1.2rem' }}>Redux-Store</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
            </Nav>
            <Nav className="d-flex align-items-center">
              <Nav.Link
                as={Link}
                to="/cart"
                className="text-decoration-none text-dark d-flex align-items-center"
              >
                <Cart size={24} />
                {totalUniqueItems > 0 && (
                  <Badge bg="danger" className="ms-1">
                    {totalUniqueItems}
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
              <Nav.Link className='text-decoration-none text-dark d-flex align-items-center' as={Link} to='/login'><PersonFill size={24} /></Nav.Link>
              <Nav.Link className='text-decoration-none text-dark d-flex align-items-center'><BoxArrowRight size={24} onClick={handleLogout}/></Nav.Link>
              </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default NavbarComponent;
