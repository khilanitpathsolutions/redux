import React, { useEffect, useMemo, useState } from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import NavbarComponent from "../components/navbar";
import CustomModal from "../components/modal";
import { removeFromCartInFirestore, updateQuantityInFirestore } from "../services/firebase";
import { useCart } from "../utils/cartContext";

const Cart = () => {
  const [modalData, setModalData] = useState({
    showConfirmModal: false,
    itemToRemove: null
  });
  const {cartItems,user,fetchCartItems} = useCart()
  useEffect(() => {
    if (user) {
      fetchCartItems();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleIncrement = (item) => {
    const newQuantity = item.quantity + 1;
    updateQuantityInFirestore(user.uid, item.id, newQuantity)
      .then(() => {
        fetchCartItems();
      })
      .catch((error) => {
        console.error("Error updating quantity:", error);
      });
  };

  const handleDecrement = (item) => {
    const newQuantity = item.quantity - 1;
    if (newQuantity >= 0) {
      updateQuantityInFirestore(user.uid, item.id, newQuantity)
        .then(() => {
          fetchCartItems();
        })
        .catch((error) => {
          console.error("Error updating quantity:", error);
        });
    }
  };

  const handleRemove = (itemId) => {
    removeFromCartInFirestore(user.uid, itemId)
      .then(() => {
        fetchCartItems();
      })
      .catch((error) => {
        console.error("Error removing item:", error);
      });
  };

  const calculateSubTotal = useMemo(() => {
    const items = cartItems || [];
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cartItems]);

  const calculateTaxes = useMemo(() => {
    const taxes = calculateSubTotal * 0.18;
    return taxes;
  }, [calculateSubTotal]);

  return (
    <>
      <NavbarComponent cartItem={cartItems} />
      <Container>
        <h2>Cart Items</h2>
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            <Row xs={1} sm={2} md={3} lg={4} className="g-4">
              {cartItems.map((item) => (
                <Col key={item.id}>
                  <Card
                    style={{
                      border: "1px solid black",
                      borderRadius: "20px",
                      marginBottom: "10px"
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
                          justifyContent: "center"
                        }}
                      >
                        <Card.Img
                          src={item.image}
                          alt="error"
                          style={{
                            width: "150px",
                            height: "150px",
                            marginBottom: "10px"
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
                          onClick={() => handleDecrement(item)}
                        >
                          -
                        </Button>
                        <span style={{ padding: "6px" }}>{item.quantity}</span>
                        <Button
                          variant="primary"
                          onClick={() => handleIncrement(item)}
                        >
                          +
                        </Button>
                        <div
                          style={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "end"
                          }}
                        >
                          <Button
                            variant="danger"
                            onClick={() => {
                              setModalData({
                                showConfirmModal: true,
                                itemToRemove: item.id
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
                alignItems: "center"
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
            itemToRemove: null
          })
        }
        title="Confirm Remove"
        body="Are you sure you want to remove this item from cart?"
        onCancel={() =>
          setModalData({
            showConfirmModal: false,
            itemToRemove: null
          })
        }
        onConfirm={() => {
          handleRemove(modalData.itemToRemove);
          setModalData({
            showConfirmModal: false,
            itemToRemove: null
          });
        }}
      />
    </>
  );
};

export default Cart;
