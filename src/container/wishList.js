import React from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { toggleWishlist } from "../store/wishlistSlice";
import { Heart, HeartFill } from "react-bootstrap-icons";


const WishList = () => {
  const wishlistItems = useSelector((state) => state.wishlist);
  const dispatch = useDispatch();
  return (
    <>
      <Container>
        <h2>WishList Items</h2>
        <Link to="/" style={{ textDecoration: "none" }}>
          <Button variant="primary">Home</Button>
        </Link>
        {wishlistItems.length === 0 ? (
          <p>Your Wishlist is Empty</p>
        ) : (
          <>
            <Row xs={1} sm={2} md={3} lg={4} className="g-4">
              {wishlistItems.map((item) => (
                <Col key={item.id}>
                  <Card
                    style={{
                      border: "1px solid #dee2e6",
                      marginBottom: "10px",
                    }}
                  >
                  <div
                  style={{
                    display: "flex",
                    width: "99%",
                    justifyContent: "end",
                    position: "relative",
                    right: "5px",
                    top: "5px"
                  }}
                >
                  {wishlistItems.some((wishlistItem) => wishlistItem.id === item.id) ? (
                    <HeartFill
                      size={25}
                      onClick={() => dispatch(toggleWishlist(item))} 
                      style={{ color: "#ff4d4d", cursor: "pointer" }}
                    />
                  ) : (
                    <Heart
                      size={25}
                      onClick={() => dispatch(toggleWishlist(item))} 
                      style={{ cursor: "pointer" }}
                    />
                  )}
                </div>
                    <Card.Body className="d-flex flex-column align-items-center">
                      <p>{item.title}</p>
                      <img
                        src={item.images[0]}
                        alt="error"
                        style={{
                          width: "150px",
                          height: "150px",
                          marginBottom: "10px",
                        }}
                      />
                      <Card.Text>Price: {item.price} ₹ | Discount: {item.discountPercentage}%</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
            <hr></hr>
          </>
        )}
      </Container>
    </>
  );
};

export default WishList;
