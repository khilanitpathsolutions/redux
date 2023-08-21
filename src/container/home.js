import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../store/cartSlice";
import { toggleWishlist } from "../store/wishlistSlice";
import { toggleTheme } from "../store/themeSlice"; 
import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap";
import NavbarComponent from "../components/navbar";
import { Heart, HeartFill } from "react-bootstrap-icons";
import { BASE_URL } from "../utils/constants";

const Home = () => {
  const [product, setProduct] = useState([]); 
  const [loading,setLoading] = useState(true)
  const wishlist = useSelector((state) => state.wishlist);
  const theme = useSelector((state) => state.theme);

  const themeStyles = {
    light: {
      backgroundColor: "white",
      textColor: "black",
    },
    dark: {
      backgroundColor: "#333",
      textColor: "black",
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
    }finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div style={{ ...themeStyles[theme], minHeight: "100vh" }}>
      <NavbarComponent />
      <br />
      {loading ? (
        <div className="d-flex justify-content-center align-items-center h-100">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
      <Container className="my-4">
        <Button
          onClick={() => dispatch(toggleTheme())}
          variant="primary"
          style={{ marginBottom: "10px" }}
        >
          Toggle Theme
        </Button>
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {product.map((item) => (
            <Col key={item.id}>
              <Card style={{ height: "100%" }}>
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
                  {wishlist.some((wishlistItem) => wishlistItem.id === item.id) ? (
                    <HeartFill
                      size={30}
                      onClick={() => dispatch(toggleWishlist(item))}
                      style={{ color: "#ff4d4d", cursor: "pointer" }}
                    />
                  ) : (
                    <Heart
                      size={30}
                      onClick={() => dispatch(toggleWishlist(item))}
                      style={{ cursor: "pointer" }}
                    />
                  )}
                </div>
                <Card.Img
                  variant="top"
                  src={item.image}
                  style={{
                    width: "100%",
                    maxWidth: "300px",
                    height: "300px",
                    padding: "10px",
                  }}
                />
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="text-truncate">
                    {item.title}
                  </Card.Title>
                  <Card.Text className="h6 text-truncate">{item.description}</Card.Text>
                  <Card.Text className="h5">Category: {item.category}</Card.Text>
                  <Card.Text className="h3">
                    Price: {item.price} ₹
                  </Card.Text>
                </Card.Body>
                <Button
                  onClick={() => dispatch(addToCart(item))}
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
            <hr></hr>
    </div>
  );
};

export default Home;
