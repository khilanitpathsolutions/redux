import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleWishlist } from "../store/wishlistSlice";
import { Container, Row, Col, Card } from "react-bootstrap";
import { Heart, HeartFill } from "react-bootstrap-icons";
import NavbarComponent from "../components/navbar";

const WishList = () => {
  const wishlistItems = useSelector((state) => state.wishlist);
  const loggedInUsername = useSelector((state) => state.user.loggedInUsername);
  const dispatch = useDispatch();

  return (
    <>
      <NavbarComponent />
    <Container>
      <h2>WishList Items</h2>
      {wishlistItems[loggedInUsername]?.length === 0 ? (
        <p>Your Wishlist is Empty</p>
      ) : (
        <>
          <Row xs={1} sm={2} md={3} lg={4} className="g-4">
            {wishlistItems[loggedInUsername]?.map((item) => (
              <Col key={item.id}>
                <Card style={{ border: "1px solid black",borderRadius:'15px', marginBottom: "10px" }}>
                  <div style={{ display: "flex",
                    width: "99%",
                    justifyContent: "end",
                    position: "relative",
                    right: "5px",
                    top: "5px"}}>
                    {wishlistItems[loggedInUsername]?.some((wishlistItem) => wishlistItem.id === item.id) ? (
                      <HeartFill
                        size={25}
                        onClick={() => dispatch(toggleWishlist({ username: loggedInUsername, item }))} 
                        style={{ color: "#ff4d4d", cursor: "pointer" }}
                      />
                    ) : (
                      <Heart
                        size={25}
                        onClick={() => dispatch(toggleWishlist({ username: loggedInUsername, item }))} 
                        style={{ cursor: "pointer" }}
                      />
                    )}
                  </div>
                  <Card.Body className="d-flex flex-column">
                    <Card.Title className="text-truncate">{item.title}</Card.Title>
                    <div style={{width:'100%',display:'flex',justifyContent:'center'}}>
                    <Card.Img
                      src={item.image}
                      alt="error"
                      style={{ width: "150px", height: "150px", marginBottom: "10px" }}
                    /></div>
                    <Card.Text>Category: {item.category}</Card.Text>
                    <Card.Text className="h6">Price: {item.price} ₹ | Discount: {item.rating.rate}%</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
          <hr />
        </>
      )}
    </Container>
    </>
  );
};

export default WishList;
