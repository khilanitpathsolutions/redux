import React, { useCallback } from "react";
import { addToCart } from "../store/reducers/cartSlice";
import { useParams } from "react-router-dom";
import { Button, Card, Spinner, Row, Col } from "react-bootstrap";
import NavbarComponent from "../components/navbar";
import { useDispatch, useSelector } from "react-redux";
import useFetch from "../hooks/useFetch";
import WishlistIcon from "../components/wishlistIcon";
import useToggleWishlist from "../hooks/useToggleWishlist";

const Product = () => {
  const { item_id } = useParams();
  const loggedInEmail = useSelector((state) => state.user.loggedInEmail);
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const dispatch = useDispatch();

  const { data: fetchedData, loading } = useFetch(`/products/${item_id}`);
  const product = fetchedData.data;

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

  const handleToggleWishlist = useToggleWishlist()

  return (
    <>
      <NavbarComponent />
      <br />
      {loading ? (
        <div className="d-flex justify-content-center align-items-center h-100">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <Card
          style={{
            margin: "0 auto",
            width: "95%",
            border: "1px solid black",
            borderRadius: "25px",
          }}
        >
          <WishlistIcon
            item={product}
            onToggleWishlist={handleToggleWishlist}
          />
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
