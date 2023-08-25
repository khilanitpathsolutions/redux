import React, { useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {incrementQuantity,decrementQuantity,removeItem} from "../store/reducers/cartSlice";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import NavbarComponent from "../components/navbar";
import CustomModal from "../components/modal";

const Cart = () => {
  const [modalData, setModalData] = useState({
    showConfirmModal: false,
    itemToRemove: null,
  });
  const cartItems = useSelector((state) => state.cart);
  const loggedInEmail = useSelector((state) => state.user.loggedInEmail);
  const dispatch = useDispatch();

  const calculateSubTotal = useMemo(() => {
    const items = cartItems[loggedInEmail] || [];
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cartItems, loggedInEmail]);

  const calculateTaxes = useMemo(() => {
    const taxes = calculateSubTotal * 0.18;
    return taxes;
  }, [calculateSubTotal]);

  return (
    <>
      <NavbarComponent />
      <Container>
        <h2>Cart Items</h2>
        {cartItems[loggedInEmail]?.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            <Row xs={1} sm={2} md={3} lg={4} className="g-4">
              {cartItems[loggedInEmail]?.map((item) => (
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
                                email: loggedInEmail,
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
                                email: loggedInEmail,
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
                            onClick={() => {
                              setModalData({
                                showConfirmModal: true,
                                itemToRemove: item.id,
                              });
                            }}
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

      <CustomModal
        show={modalData.showConfirmModal}
        onHide={() =>
          setModalData({
            showConfirmModal: false,
            itemToRemove: null,
          })
        }
        title="Confirm Remove"
        body="Are you sure you want to remove this item from cart ?"
        onCancel={() =>
          setModalData({
            showConfirmModal: false,
            itemToRemove: null,
          })
        }
        onConfirm={() => {
          dispatch(
            removeItem({
              email: loggedInEmail,
              itemId: modalData.itemToRemove,
            })
          );
          setModalData({
            showConfirmModal: false,
            itemToRemove: null,
          });
        }}
      />
    </>
  );
};

export default Cart;
