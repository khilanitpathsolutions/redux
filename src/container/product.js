import React, { useEffect, useState } from "react";
import { BASE_URL } from "../utils/constants";
import axios from "axios";
import { addToCart } from "../store/cartSlice";
import { toggleWishlist } from "../store/wishlistSlice";
import { useParams } from "react-router-dom";
import { Button, Card, Spinner, Row, Col } from "react-bootstrap";
import NavbarComponent from "../components/navbar";
import { useDispatch, useSelector } from "react-redux";
import { Heart, HeartFill } from "react-bootstrap-icons";

const Product = () => {
  const { item_id } = useParams();
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const loggedInUsername = useSelector((state) => state.user.loggedInUsername);
  const wishlist = useSelector((state) => state.wishlist);
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const dispatch = useDispatch();

  const fetchData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/${item_id}`);
      const productData = response.data;
      console.log(productData);
      setProduct(productData);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  return (
    <>
      <NavbarComponent />
      <br />
      {loading ? (
        <div className="d-flex justify-content-center align-items-center h-100">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <Card style={{ margin: "0 auto", width: "95%",border:'1px solid black',borderRadius:'25px' }}>
        <div
                    style={{
                      display: "flex",
                      width: "99%",
                      justifyContent: "end",
                      position: "relative",
                      right: "5px",
                      top: "15px",
                    }}
                  >
                    {wishlist[loggedInUsername]?.some(
                      (wishlistItem) => wishlistItem.id === product.id
                    ) ? (
                      <HeartFill
                        size={30}
                        onClick={() => handleToggleWishlist(product)}
                        style={{ color: "#ff4d4d", cursor: "pointer" }}
                      />
                    ) : (
                      <Heart
                        size={30}
                        onClick={() => handleToggleWishlist(product)}
                        style={{ cursor: "pointer" }}
                      />
                    )}
                  </div>
          <Row>
            <Col md={4}>
              <Card.Img
                src={product.image}
                alt={product.title}
                style={{
                  width: "100%",
                  maxWidth: "350px",
                  height: "350px",
                  padding: "10px",
                }}
              />
            </Col>
            <Col md={8}>
              <Card.Body>
                <Card.Text>Product ID: {product.id}</Card.Text>
                <Card.Text className="h3">{product.title}</Card.Text>
                <br />
                <Card.Text className="h5">{product.description}</Card.Text>
                <br />
                <Card.Text className="h5">
                  Category: {product.category}
                </Card.Text>
                <Card.Text className="h4">Price: ${product.price}</Card.Text>

                <Card.Text>
                  Ratings: {product.rating.rate}⭐ (Rated by:{" "}
                  {product.rating.count} Users)
                </Card.Text>

                <div className="d-grid row gy-3 mt-auto  w-100">
                  <Button
                    variant="warning"
                    style={{ width: "300px" }}
                    onClick={() => handleAddToCart(product)}
                  >
                    Add To Cart
                  </Button>
                </div>
              </Card.Body>
            </Col>
          </Row>
        </Card>
      )}
      <br></br>
    </>
  );
};

export default Product;
