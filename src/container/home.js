import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../store/cartSlice";
import { toggleWishlist } from "../store/wishlistSlice";
import { toggleTheme } from "../store/themeSlice"; 

import { Container, Row, Col, Card, Button } from "react-bootstrap";
import NavbarComponent from "../components/navbar";
import { Heart, HeartFill } from "react-bootstrap-icons";

const Home = () => {
  const [product, setProduct] = useState([]); 
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
      const response = await axios.get("https://dummyjson.com/products?limit=32");
      const data = response.data.products;
      console.log(data);
      setProduct(data); 
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div style={{ ...themeStyles[theme], minHeight: "100vh" }}>
      <NavbarComponent />
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
                  src={item.images[0]}
                  style={{
                    width: "100%",
                    maxWidth: "350px",
                    height: "350px",
                    padding: "10px",
                  }}
                />
                <Card.Body className="d-flex flex-column">
                  <Card.Title style={{ color: themeStyles[theme].textColor }}>
                    {item.title}
                  </Card.Title>
                  <Card.Text style={{ color: themeStyles[theme].textColor }}>
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
    </div>
  );
};

export default Home;
