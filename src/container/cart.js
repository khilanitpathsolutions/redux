import React, { useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  incrementQuantity,
  decrementQuantity,
  removeItem,
} from "../store/cartSlice";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import NavbarComponent from "../components/navbar";

const Cart = () => {
  const cartItems = useSelector((state) => state.cart);
  const loggedInUsername = useSelector((state) => state.user.loggedInUsername);
  const dispatch = useDispatch();

  const calculateSubTotal = useMemo(() => {
    const items = cartItems[loggedInUsername] || [];
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cartItems, loggedInUsername]);

  const calculateTaxes = useMemo(() => {
    const taxes = calculateSubTotal * 0.18;
    return taxes;
  }, [calculateSubTotal]);

  return (
    <>
      <NavbarComponent />
      <Container>
        <h2>Cart Items</h2>
        {cartItems[loggedInUsername]?.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            <Row xs={1} sm={2} md={3} lg={4} className="g-4">
              {cartItems[loggedInUsername]?.map((item) => (
                <Col key={item.id}>
                  <Card
                    style={{
                      border: "1px solid black",
                      borderRadius: "20px",
                      marginBottom: "10px",
                    }}
                  >
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
                      <Card.Text className="h5">
                        Price: {item.price} ₹
                      </Card.Text>
                      <Card.Text className="h4">
                        Total Price: {(item.price * item.quantity).toFixed(1)}
                      </Card.Text>
                      <div className="d-flex align-items-center">
                        <Button
                          variant="primary"
                          onClick={() =>
                            dispatch(
                              decrementQuantity({
                                username: loggedInUsername,
                                itemId: item.id,
                              })
                            )
                          }
                        >
                          -
                        </Button>
                        <span style={{ padding: "6px" }}>{item.quantity}</span>
                        <Button
                          variant="primary"
                          onClick={() =>
                            dispatch(
                              incrementQuantity({
                                username: loggedInUsername,
                                itemId: item.id,
                              })
                            )
                          }
                        >
                          +
                        </Button>
                        <div
                          style={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "end",
                          }}
                        >
                          <Button
                            variant="danger"
                            onClick={() =>
                              dispatch(
                                removeItem({
                                  username: loggedInUsername,
                                  itemId: item.id,
                                })
                              )
                            }
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>

            <div
              className="mt-4"
              style={{
                background: "#e6fff2",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <h3>Cart-Total</h3>
              <h6>Sub Total: ₹{calculateSubTotal.toFixed(1)}</h6>
              <h6>Taxes: ₹{calculateTaxes.toFixed(1)}</h6>
              <h2>
                Total Amount: ₹
                {Number(calculateSubTotal + calculateTaxes).toFixed(1)}
              </h2>
            </div>
          </>
        )}
        <hr />
      </Container>
    </>
  );
};

export default Cart;
