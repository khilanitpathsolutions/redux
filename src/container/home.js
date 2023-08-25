import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../store/reducers/cartSlice";
import { toggleTheme } from "../store/reducers/themeSlice";
import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap";
import NavbarComponent from "../components/navbar";
import ImageSwiper from "../components/swiper";
import { useNavigate } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import WishlistIcon from "../components/wishlistIcon";
import useToggleWishlist from "../hooks/useToggleWishlist";

const Home = () => {
  const theme = useSelector((state) => state.theme);
  const loggedInEmail = useSelector((state) => state.user.loggedInEmail);
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const navigate = useNavigate();

  const themeStyles = {
    light: {
      backgroundColor: "#e3e3e3",
      textColor: "black",
    },
    dark: {
      backgroundColor: "#333",
      textColor: "white",
    },
  };

  const dispatch = useDispatch();

  const { data: fetchedData, loading } = useFetch("/products");
  const products = fetchedData.data;

  const handleAddToCart = useCallback(
    (item) => {
      if (isLoggedIn) {
        dispatch(addToCart({ email: loggedInEmail, item }));
      } else {
        alert("Please Login to Add product to Cart & Wishlist");
      }
    },
    [isLoggedIn, loggedInEmail, dispatch]
  );

  const handleToggleWishlist = useToggleWishlist();

  const handleViewProduct = useCallback(
    (itemId) => {
      navigate(`/product/${itemId}`);
    },
    [navigate]
  );

  const handleAddProduct = useCallback(() => {
    if (isLoggedIn) {
      navigate("/addproduct");
    } else {
      alert("Please Login to Add product into the Store");
    }
  }, [isLoggedIn, navigate]);
  
   return (
    <div
      style={{
        ...themeStyles[theme],
        minHeight: "100vh",
        color: themeStyles[theme].textColor,
      }}
    >
      <NavbarComponent />
      <ImageSwiper />
      {loading ? (
        <div className="d-flex justify-content-center align-items-center h-100">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <Container className="my-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <Button variant="secondary" onClick={handleAddProduct}>
              ADD Products
            </Button>
            <Button onClick={() => dispatch(toggleTheme())} variant="primary">
              Toggle Theme
            </Button>
          </div>

          <Row xs={1} sm={2} md={3} lg={4} className="g-4">
            {products.map((item) => (
              <Col key={item.id}>
                <Card style={{ height: "100%", borderRadius: "20px" }}>
                <WishlistIcon
                item={item}
                onToggleWishlist={handleToggleWishlist}
              />
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <Card.Img
                      variant="top"
                      src={item.image}
                      alt="error"
                      style={{
                        width: "220px",
                        height: "220px",
                        padding: "10px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleViewProduct(item.id)}
                    />
                  </div>
                  <Card.Body className="d-flex flex-column">
                    <Card.Title className="text-truncate">
                      {item.title}
                    </Card.Title>
                    <Card.Text className="h6 text-truncate">
                      {item.description}
                    </Card.Text>
                    <Card.Text className="h5">
                      Category: {item.category}
                    </Card.Text>
                    <Card.Text className="h3">Price: {item.price} ₹</Card.Text>
                    <Card.Text>
                      Rating: {item.rating.rate}⭐ Rated By: (
                      {item.rating.count} Users)
                    </Card.Text>
                  </Card.Body>
                  <Button
                    onClick={() => handleAddToCart(item)}
                    variant="warning"
                    style={{ margin: "10px" }}
                  >
                    ADD TO CART
                  </Button>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      )}
      <div style={{ display: "flex", justifyContent: "end", margin: "5px" }}>
        <Button
          onClick={() => window.scrollTo({ top: 0, behaviour: "smooth" })}
        >
          ↑
        </Button>
      </div>
      <hr />
    </div>
  );
};

export default Home;
