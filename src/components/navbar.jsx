import React, { useState } from "react";
import { Badge, Container, Nav, Navbar } from "react-bootstrap";
import { Cart, Heart, BoxArrowRight, PersonFill } from "react-bootstrap-icons";
import { useSelector, useDispatch } from "react-redux";
import logo from "../assets/redux.svg";
import { Link } from "react-router-dom";
import { logout } from "../store/reducers/userSlice";
import CustomModal from "./modal";
import {auth} from "../services/firebase";

const NavbarComponent = () => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const dispatch = useDispatch();
  const userLoggedInEmail = useSelector((state) => state.user.loggedInEmail);
  const cartItems = useSelector((state) => state.cart[userLoggedInEmail] || []);
  const wishlistItems = useSelector(
    (state) => state.wishlist[userLoggedInEmail] || []
  );
  const totalUniqueCartItems = cartItems.length;
  const totalWishlistItems = wishlistItems.length;
  const loggedInEmail = useSelector((state) => state.user.loggedInEmail);

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      dispatch(logout());
      setShowLogoutModal(false);
      console.log("User successfully logged out");
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      <Navbar
        bg="secondary"
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
              <span style={{ color: "black" }}>Redux-Store</span>
            </Navbar.Brand>
          </div>

          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto"></Nav>
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <h5 style={{ fontFamily: "cursive" }}>
                {loggedInEmail ? `LoggedInUser: ${loggedInEmail}` : ""}
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

      <CustomModal
        show={showLogoutModal}
        onHide={() => setShowLogoutModal(false)}
        title="Confirm Sign Out"
        body="Are you sure you want to sign out?"
        onCancel={() => setShowLogoutModal(false)}
        onConfirm={handleSignOut}
      />
    </>
  );
};

export default NavbarComponent;
