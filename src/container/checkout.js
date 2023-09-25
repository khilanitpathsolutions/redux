import React, { useEffect, useMemo, useState } from "react";
import {Container,Row,Col,Form,Button,Card,Spinner,} from "react-bootstrap";
import NavbarComponent from "../components/navbar";
import { useCart } from "../utils/cartContext";
import "../index.css";
import gpay from "../assets/gpay.svg";
import paytm from "../assets/Paytm.svg";
import phonepe from "../assets/phonepe.svg";
import upi from "../assets/upi.svg";
import { useNavigate } from "react-router-dom";
import { addOrderToFirestore } from "../services/firebase";

const Checkout = () => {
  const { cartItems, user, fetchCartItems } = useCart();

  useEffect(() => {
    if (user) {
      fetchCartItems();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [paymentMethod, setPaymentMethod] = useState("Card");
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    phoneNumber: "",
  });

 const [orderData, setOrderData] = useState({
    paymentMethod: {
      card: {
        cardHolderName: "",
        cardNumber: "",
        expiryDate: "",
        cvv: "",
      },
      upi: "",
    },
  });


  const handleRadioChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleShippingInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prevAddress) => ({
      ...prevAddress,
      [name]: value,
    }));
  };

  const handlePaymentInputChange = (e) => {
    const { name, value } = e.target;
    setOrderData((prevData) => ({
      ...prevData,
      paymentMethod: {
        card: {
          ...prevData.paymentMethod.card,
          [name]: value,
        },
      },
    }));
  };
  
    const handleSubmit = async () => {
    setLoading(true);
    const order = {
      userId: user.uid,
      shippingAddress: shippingAddress,
      paymentMethod:
        paymentMethod === "Card" ? orderData.paymentMethod.card : "UPI",
      items: cartItems,
      subTotal: calculateSubTotal.toFixed(1),
      taxes: calculateTaxes.toFixed(1),
      totalAmount: Number(calculateSubTotal + calculateTaxes).toFixed(1),
    };
    try {
      await addOrderToFirestore(user.uid, order);
      //setLoading(false);
      setTimeout(()=>{
        setLoading(true)
        navigate("/orderConfirm");
        },2000)
    } catch (error) {
      console.error("Error adding order: ", error);
      setLoading(false);
    }
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
      <NavbarComponent />
      <br></br>
      <Container>
        <Row>
          <Col md={6}>
            <h2>Shipping Address</h2>
            <Form>
              <Form.Group controlId="formBasicName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  onChange={handleShippingInputChange}
                />
              </Form.Group>

              <Form.Group controlId="formBasicAddress">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  name="address"
                  placeholder="Enter your address"
                  onChange={handleShippingInputChange}
                />
              </Form.Group>

              <Form.Group controlId="formBasicCity">
                <Form.Label>City</Form.Label>
                <Form.Control
                  type="text"
                  name="city"
                  placeholder="Enter your city"
                  onChange={handleShippingInputChange}
                />
              </Form.Group>

              <Form.Group controlId="formBasicState">
                <Form.Label>State</Form.Label>
                <Form.Control
                  type="text"
                  name="state"
                  placeholder="Enter your State"
                  onChange={handleShippingInputChange}
                />
              </Form.Group>

              <Form.Group controlId="formBasicNumber">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type="number"
                  name="phoneNumber"
                  placeholder="Enter your phone number"
                  onChange={handleShippingInputChange}
                />
              </Form.Group>
            </Form>
            <br></br>

            <h2>Payment Method</h2>
            <Form>
              <Form.Group className="d-flex gap-4">
                <Form.Check
                  type="radio"
                  label="Card"
                  name="paymentMethod"
                  checked={paymentMethod === "Card"}
                  onChange={() => setPaymentMethod("Card")}
                />
                <Form.Check
                  type="radio"
                  label="UPI"
                  name="paymentMethod"
                  checked={paymentMethod === "UPI"}
                  onChange={() => setPaymentMethod("UPI")}
                />
              </Form.Group>

              {paymentMethod === "Card" && (
                <>
                  <div>
                    <h2>Card Information</h2>

                    <Form.Group controlId="formBasicCardName">
                      <Form.Label>Card-Holder Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="cardHolderName"
                        placeholder="Enter the Card-Holder Name"
                        onChange={handlePaymentInputChange}
                      />
                    </Form.Group>

                    <Form.Group controlId="formBasicCardNumber">
                      <Form.Label>Card Number</Form.Label>
                      <Form.Control
                        name="cardNumber"
                        type="number"
                        placeholder="Enter your card number"
                        onChange={handlePaymentInputChange}
                      />
                    </Form.Group>

                    <Form.Group
                      controlId="formBasicExpiryDate"
                      className="d-flex justify-content-between"
                    >
                      <div style={{ width: "60%" }}>
                        <Form.Label>Expiry Date</Form.Label>
                        <Form.Control name="expiryDate" type="Date" placeholder="MM/YY" onChange={handlePaymentInputChange}/>
                      </div>
                      <div>
                        <Form.Label>CVV</Form.Label>
                        <Form.Control name="cvv" type="number" placeholder="Enter CVV" onChange={handlePaymentInputChange} />
                      </div>
                    </Form.Group>
                  </div>
                </>
              )}
              {paymentMethod === "UPI" && (
                <div>
                  <h2>UPI Information</h2>
                  <Form.Group className="logo d-flex justify-content-evenly">
                    <div className="d-flex align-items-center">
                      <Form.Check
                        type="radio"
                        label=""
                        value="gpay"
                        checked={selectedOption === "gpay"}
                        onChange={handleRadioChange}
                      />
                      <img
                        src={gpay}
                        alt="error"
                        style={{ height: "40px", width: "80px" }}
                      />
                    </div>

                    <div className="d-flex align-items-center">
                      <Form.Check
                        type="radio"
                        label=""
                        value="paytm"
                        checked={selectedOption === "paytm"}
                        onChange={handleRadioChange}
                      />
                      <img
                        src={paytm}
                        alt="error"
                        style={{ height: "100px", width: "100px" }}
                      />
                    </div>

                    <div className="d-flex align-items-center">
                      <Form.Check
                        type="radio"
                        label=""
                        value="phonepe"
                        checked={selectedOption === "phonepe"}
                        onChange={handleRadioChange}
                      />
                      <img
                        src={phonepe}
                        alt="error"
                        style={{ height: "60px", width: "65px" }}
                      />
                    </div>

                    <div className="d-flex align-items-center">
                      <Form.Check
                        type="radio"
                        label=""
                        value="upi"
                        checked={selectedOption === "upi"}
                        onChange={handleRadioChange}
                      />
                      <img
                        src={upi}
                        alt="error"
                        style={{ height: "80px", width: "80px" }}
                      />
                    </div>
                  </Form.Group>
                </div>
              )}
              <div
                className="d-flex w-100 justify-content-center align-items-center"
                style={{ marginTop: "20px" }}
              >
                <Button
                  variant="warning"
                  type="submit"
                  disabled={loading}
                  onClick={handleSubmit}
                >
                  {loading ? (
                    <>
                      <Spinner animation="border" size="sm" /> Checking Out...
                    </>
                  ) : (
                    "Confirm-Payment"
                  )}
                </Button>
              </div>
            </Form>
          </Col>

          <Col md={6}>
            <h2>Items-Summary</h2>
            {cartItems.map((items) => (
              <Card
                style={{
                  border: "1px solid gray",
                  padding: "2px",
                  margin: "5px",
                }}
                className="d-flex align-items-center justify-content-center "
                key={items.id}
              >
                <Card.Img
                  src={items.image}
                  alt="error"
                  style={{ width: "70px", height: "70px" }}
                />
                <Card.Title>{items.title}</Card.Title>
                <Card.Text className="h5">
                  Price: {items.price} ₹ || Quantity x {items.quantity}
                </Card.Text>
              </Card>
            ))}
            <hr></hr>
            <div
              className="d-flex"
              style={{
                margin: "5px",
                border: "2px solid #6ca98d",
                borderRadius: "10px",
              }}
            >
              <Form.Control type="text" placeholder="Coupon Code" />
              <Button variant="primary">Apply</Button>
            </div>
            <br></br>
            <div
              style={{ background: "#e6fff2" }}
              className="d-flex flex-column align-items-center"
            >
              <h3>Cart-Total</h3>
              <h6>Sub Total: ₹{calculateSubTotal.toFixed(1)}</h6>
              <h6>Taxes: ₹{calculateTaxes.toFixed(1)}</h6>
              <hr
                style={{
                  border: "1px solid black",
                  width: "90%",
                  margin: "10px 0",
                }}
              ></hr>
              <h2>
                Total Amount: ₹
                {Number(calculateSubTotal + calculateTaxes).toFixed(1)}
              </h2>
            </div>
            <br></br>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Checkout;
