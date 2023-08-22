import React, { useState } from "react";
import { Badge, Container, Nav, Navbar, Modal, Button } from "react-bootstrap";
import { Cart, Heart, BoxArrowRight, PersonFill } from "react-bootstrap-icons";
import { useSelector, useDispatch } from "react-redux";
import logo from "../assets/redux.svg";
import { Link } from "react-router-dom";
import { logout } from "../store/userSlice";

const NavbarComponent = () => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const dispatch = useDispatch();
  const userLoggedInUsername = useSelector((state) => state.user.loggedInUsername);
  const cartItems = useSelector((state) => state.cart[userLoggedInUsername] || []);
  const wishlistItems = useSelector((state) => state.wishlist[userLoggedInUsername] || []);

  const totalUniqueCartItems = cartItems.length;
  const totalWishlistItems = wishlistItems.length;

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const loggedInUsername = useSelector((state) => state.user.loggedInUsername);

  return (
    <>
      <Navbar
        bg="primary"
        variant="dark"
        expand="md"
        className="sticky-top"
        style={{ minHeight: "50px", paddingTop: "5px", paddingBottom: "5px" }}
      >
        <Container className="d-flex justify-content-between align-items-center p-2">
          <div>
            <Navbar.Brand className="d-flex align-items-center">
              <Link to="/">
                {" "}
                <img
                  src={logo}
                  alt="error"
                  style={{ width: "40px", height: "40px", marginRight: "10px" }}
                />
              </Link>
              <span>Redux-Store</span>
            </Navbar.Brand>
          </div>

          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto"></Nav>
            <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
              <h5 style={{ fontFamily: "cursive" }}>
                {loggedInUsername ? `LoggedInUser: ${loggedInUsername}` : ""}
              </h5>
            </div>
            <Nav className="d-flex align-items-center">
              <Nav.Link
                as={Link}
                to="/cart"
                className="text-decoration-none text-dark d-flex align-items-center"
              >
                <Cart size={24} />
                {totalUniqueCartItems > 0 && (
                  <div>
                    <Badge
                      bg="danger"
                      className="ms-1"
                      style={{
                        position: "relative",
                        top: "-15px",
                        right: "12px",
                      }}
                    >
                      {totalUniqueCartItems}
                    </Badge>
                  </div>
                )}
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/wishlist"
                className="text-decoration-none text-dark d-flex align-items-center"
              >
                <Heart size={24} />
                {totalWishlistItems > 0 && (
                  <div>
                    <Badge
                      bg="danger"
                      className="ms-1"
                      style={{
                        position: "relative",
                        top: "-15px",
                        right: "12px",
                      }}
                    >
                      {totalWishlistItems}
                    </Badge>
                  </div>
                )}
              </Nav.Link>
              <Nav.Link
                className="text-decoration-none text-dark d-flex align-items-center"
                as={Link}
                to="/login"
              >
                <PersonFill size={24} />
              </Nav.Link>
              <Nav.Link className="text-decoration-none text-dark d-flex align-items-center">
                <BoxArrowRight size={24} onClick={handleLogout} />
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Modal show={showLogoutModal} onHide={() => setShowLogoutModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Sign Out</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to sign out?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowLogoutModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={() => {
            dispatch(logout());
            setShowLogoutModal(false);
          }}>
            Sign Out
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default NavbarComponent;
