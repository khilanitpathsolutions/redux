import React, { useEffect, useMemo, useState } from "react";
import {Container,Row,Col,Form,Button,Card,Spinner,Toast,} from "react-bootstrap";
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
  }, [user]);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState("");
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

  const [validationErrors, setValidationErrors] = useState({
    cardHolderName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    name: "",
    address: "",
    city: "",
    state: "",
    phoneNumber: "",
  });
  const showSuccess = () => {
    setShowSuccessToast(true);
  };

  const showError = () => {
    setShowErrorToast(true);
  };

  const hideSuccess = () => {
    setShowSuccessToast(false);
  };

  const hideError = () => {
    setShowErrorToast(false);
  };

  const handleRadioChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleCouponCodeChange = (e) => {
    setCouponCode(e.target.value);
  };

  const handleShippingInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prevAddress) => ({
      ...prevAddress,
      [name]: value,
    }));
    const isValid = !!value;
    if (name === "phoneNumber" && value.length !== 10) {
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "Mobile number must be 10 digits.",
      }));
    } else {
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        [name]: isValid ? "" : `${name} is required.`,
      }));
    }
  };

  const handleCardInputChange = (e) => {
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
    const isValid = validateCardDetails(name, value);
    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      [name]: isValid ? "" : `Invalid ${name}.`,
    }));
  };

  const validateCardDetails = (name, value) => {
    if (name === "cardHolderName") {
      return !!value;
    } else if (name === "cardNumber") {
      return /^\d{16}$/.test(value);
    } else if (name === "cvv") {
      return /^\d{3}$/.test(value);
    } else if (name === "expiryDate") {
      return !!value;
    }
    return true;
  };

  const validateShippingAddress = () => {
    const errors = {};
    const requiredFields = ["name", "address", "city", "state", "phoneNumber"];
    requiredFields.forEach((field) => {
      if (!shippingAddress[field]) {
        errors[field] = `${field} is required.`;
      }
    });
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isCardValid =
      paymentMethod === "Card"
        ? validateCardDetails(
            "cardHolderName",
            orderData.paymentMethod.card.cardHolderName
          ) &&
          validateCardDetails(
            "cardNumber",
            orderData.paymentMethod.card.cardNumber
          ) &&
          validateCardDetails(
            "expiryDate",
            orderData.paymentMethod.card.expiryDate
          ) &&
          validateCardDetails("cvv", orderData.paymentMethod.card.cvv)
        : true;

    const isShippingValid = validateShippingAddress();

    if (!paymentMethod) {
      return;
    }

    if (isCardValid && isShippingValid) {
      setLoading(true);

      const order = {
        userId: user.uid,
        shippingAddress: shippingAddress,
        paymentMethod:
          paymentMethod === "Card" ? orderData.paymentMethod.card : "UPI",
        items: cartItems,
        subTotal: calculateSubTotal.toFixed(1),
        taxes: calculateTaxes.toFixed(1),
        discount: Number(
          (calculateSubTotal + calculateTaxes) * discountPercentage
        ).toFixed(1),
        totalAmount: Number(
          (calculateSubTotal + calculateTaxes) * (1 - discountPercentage)
        ).toFixed(1),
      };

      try {
        await addOrderToFirestore(user.uid, order);
        setLoading(false);
        navigate("/orderConfirm");
      } catch (error) {
        console.error("Error adding order: ", error);
        setLoading(false);
      }
    }
  };

  const [couponCode, setCouponCode] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState(0);

  const applyCouponCode = () => {
    const couponCodes = {
      sub50: 0.5,
      sub25: 0.25,
      sub10: 0.1,
    };
    if (couponCode in couponCodes) {
      showSuccess(); 
      setDiscountPercentage(couponCodes[couponCode]);
    } else {
      showError();
      setDiscountPercentage(0);
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
                <div className="text-danger">{validationErrors.name}</div>
              </Form.Group>

              <Form.Group controlId="formBasicAddress">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  name="address"
                  placeholder="Enter your address"
                  onChange={handleShippingInputChange}
                />
                <div className="text-danger">{validationErrors.address}</div>
              </Form.Group>

              <Form.Group controlId="formBasicCity">
                <Form.Label>City</Form.Label>
                <Form.Control
                  type="text"
                  name="city"
                  placeholder="Enter your city"
                  onChange={handleShippingInputChange}
                />
                <div className="text-danger">{validationErrors.city}</div>
              </Form.Group>

              <Form.Group controlId="formBasicState">
                <Form.Label>State</Form.Label>
                <Form.Control
                  type="text"
                  name="state"
                  placeholder="Enter your State"
                  onChange={handleShippingInputChange}
                />
                <div className="text-danger">{validationErrors.state}</div>
              </Form.Group>

              <Form.Group controlId="formBasicNumber">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type="number"
                  name="phoneNumber"
                  placeholder="Enter your phone number"
                  onChange={handleShippingInputChange}
                />
                <div className="text-danger">
                  {validationErrors.phoneNumber}
                </div>
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
                        onChange={handleCardInputChange}
                      />
                      <div className="text-danger">
                        {validationErrors.cardHolderName}
                      </div>
                    </Form.Group>

                    <Form.Group controlId="formBasicCardNumber">
                      <Form.Label>Card Number</Form.Label>
                      <Form.Control
                        name="cardNumber"
                        type="number"
                        placeholder="Enter your card number"
                        onChange={handleCardInputChange}
                      />
                      <div className="text-danger">
                        {validationErrors.cardNumber}
                      </div>
                    </Form.Group>

                    <Form.Group
                      controlId="formBasicExpiryDate"
                      className="d-flex justify-content-between"
                    >
                      <div style={{ width: "60%" }}>
                        <Form.Label>Expiry Date</Form.Label>
                        <Form.Control
                          name="expiryDate"
                          type="date"
                          placeholder="MM/YY"
                          onChange={handleCardInputChange}
                        />
                        <div className="text-danger">
                          {validationErrors.expiryDate}
                        </div>
                      </div>
                      <div>
                        <Form.Label>CVV</Form.Label>
                        <Form.Control
                          name="cvv"
                          type="number"
                          placeholder="Enter CVV"
                          onChange={handleCardInputChange}
                        />
                        <div className="text-danger">
                          {validationErrors.cvv}
                        </div>
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
              }}
            >
              <Form.Control
                type="text"
                placeholder="Coupon Code"
                value={couponCode}
                onChange={handleCouponCodeChange}
              />
              <Button variant="dark" onClick={applyCouponCode}>
                Apply
              </Button>
            </div>
            <br></br>
            <div
              style={{ background: "#e6fff2" }}
              className="d-flex flex-column align-items-center"
            >
              <h3>Cart-Total</h3>
              <h6>Sub Total: ₹{calculateSubTotal.toFixed(1)}</h6>
              <h6>Taxes: ₹{calculateTaxes.toFixed(1)}</h6>
              <h6>
                Discount: ₹
                {Number(
                  (calculateSubTotal + calculateTaxes) * discountPercentage
                ).toFixed(1)}
              </h6>
              <hr
                style={{
                  border: "1px solid black",
                  width: "90%",
                  margin: "10px 0",
                }}
              ></hr>
              <h2>
                Total Amount: ₹
                {Number(
                  (calculateSubTotal + calculateTaxes) *
                    (1 - discountPercentage)
                ).toFixed(1)}
              </h2>
            </div>
            <br></br>
          </Col>
        </Row>
      </Container>

      <Toast
        show={showSuccessToast}
        onClose={hideSuccess}
        className="position-fixed top-0 end-0 m-4"
        delay={3000}
        style={{ zIndex: "9999" }}
        autohide
        bg="success"
        text="white"
      >
        <Toast.Header closeButton={false}>
          <strong className="me-auto">Success</strong>
        </Toast.Header>
        <Toast.Body>Coupon Code Applied Successfully</Toast.Body>
      </Toast>

      <Toast
        show={showErrorToast}
        onClose={hideError}
        className="position-fixed top-0 end-0 m-4"
        style={{ zIndex: "9999" }}
        delay={3000}
        autohide
        bg="danger"
        text="white"
      >
        <Toast.Header closeButton={false}>
          <strong className="me-auto">Error</strong>
        </Toast.Header>
        <Toast.Body>Please Enter Valid Coupon Code</Toast.Body>
      </Toast>
    </>
  );
};

export default Checkout;
