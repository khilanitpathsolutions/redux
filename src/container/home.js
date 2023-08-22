import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../store/cartSlice";
import { toggleWishlist } from "../store/wishlistSlice";
import { toggleTheme } from "../store/themeSlice";
import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap";
import NavbarComponent from "../components/navbar";
import { Heart, HeartFill } from "react-bootstrap-icons";
import { BASE_URL } from "../utils/constants";
import axios from "axios";
import ImageSwiper from "../components/swiper";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(true);
  const wishlist = useSelector((state) => state.wishlist);
  const theme = useSelector((state) => state.theme);
  const loggedInUsername = useSelector((state) => state.user.loggedInUsername);
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

  const fetchData = async () => {
    try {
      const response = await axios.get(BASE_URL);
      const data = response.data;
      console.log(data);
      setProduct(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddToCart = (item) => {
    if (isLoggedIn) {
      dispatch(addToCart({ username: loggedInUsername, item }));
    } else {
      alert("Please Login to Add product to Cart & Wishlist");
    }
  };

  const handleToggleWishlist = (item) => {
    if (isLoggedIn) {
      dispatch(toggleWishlist({ username: loggedInUsername, item }));
    } else {
      alert("Please Login to Add product to Cart & Wishlist");
    }
  };

  const handleViewProduct = (itemId) => {
    navigate(`/product/${itemId}`);
  };

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
            <h5>Product Cards</h5>
            <Button onClick={() => dispatch(toggleTheme())} variant="primary">
              Toggle Theme
            </Button>
          </div>

          <Row xs={1} sm={2} md={3} lg={4} className="g-4">
            {product.map((item) => (
              <Col key={item.id}>
                <Card style={{ height: "100%", borderRadius: "20px" }}>
                  <div
                    style={{
                      display: "flex",
                      width: "99%",
                      justifyContent: "end",
                      position: "relative",
                      right: "5px",
                      top: "5px",
                    }}
                  >
                    {wishlist[loggedInUsername]?.some(
                      (wishlistItem) => wishlistItem.id === item.id
                    ) ? (
                      <HeartFill
                        size={30}
                        onClick={() => handleToggleWishlist(item)}
                        style={{ color: "#ff4d4d", cursor: "pointer" }}
                      />
                    ) : (
                      <Heart
                        size={30}
                        onClick={() => handleToggleWishlist(item)}
                        style={{ cursor: "pointer" }}
                      />
                    )}
                  </div>
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
      <div style={{display:"flex",justifyContent:"end",margin: "5px"}}>
     <Button onClick={()=>window.scrollTo({top: 0, behaviour: "smooth"})}>↑</Button>
     </div>
      <hr />
    </div>
  );
};

export default Home;
