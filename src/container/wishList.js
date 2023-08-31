import React, { } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import NavbarComponent from "../components/navbar";
import WishlistIcon from "../components/wishlistIcon";
import useToggleWishlist from "../hooks/useToggleWishlist";
import { useWishlist } from "../utils/wishlistContext";

const WishList = () => {
  
  const { fetchWishlistItems,wishlistItems } = useWishlist();
  const handleToggleWishlist = useToggleWishlist(fetchWishlistItems);

  return (
    <>
      <NavbarComponent />
      <Container>
        <h2>WishList Items</h2>
        {wishlistItems.length === 0 ? (
          <p>Your Wishlist is Empty</p>
        ) : (
          <>
            <Row xs={1} sm={2} md={3} lg={4} className="g-4">
              {wishlistItems.map((item) => (
                <Col key={item.id}>
                  <Card
                    style={{
                      border: "1px solid black",
                      borderRadius: "15px",
                      marginBottom: "10px",
                    }}
                  >
                    <WishlistIcon
                      item={item}
                      onToggleWishlist={()=>handleToggleWishlist(item)}
                    />

                    <Card.Body className="d-flex flex-column">
                      <Card.Title className="text-truncate">
                        {item.title}
                      </Card.Title>
                      <div
                        style={{
                          width: "100%",
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <Card.Img
                          src={item.image}
                          alt="error"
                          style={{
                            width: "150px",
                            height: "150px",
                            marginBottom: "10px",
                          }}
                        />
                      </div>
                      <Card.Text>Category: {item.category}</Card.Text>
                      <Card.Text className="h6">
                        Price: {item.price} ₹ | Discount: {item.rating.rate}%
                      </Card.Text>
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
