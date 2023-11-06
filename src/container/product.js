import React, { useCallback, useState } from "react";
import { addToCart } from "../store/reducers/cartSlice";
import { useParams } from "react-router-dom";
import { Button, Card, Row, Col, Toast, Placeholder } from "react-bootstrap";
import NavbarComponent from "../components/navbar";
import { useDispatch, useSelector } from "react-redux";
import useFetch from "../hooks/useFetch";
import WishlistIcon from "../components/wishlistIcon";
import useToggleWishlist from "../hooks/useToggleWishlist";
import { addToCartInFirestore, auth } from "../services/firebase";
import { useWishlist } from "../utils/wishlistContext";
import { useCart } from "../utils/cartContext";
import "react-lazy-load-image-component/src/effects/blur.css";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { BASE_URL } from "../utils/constants";
import axios from "axios";
import CustomModal from "../components/modal";
import { ToastContainer, toast } from "react-toastify";

const Product = () => {
  const { item_id } = useParams();
  const loggedInEmail = useSelector((state) => state.user.loggedInEmail);
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const userRole = useSelector((state) => state.user.userRole);
  const isAdmin = userRole === "admin";
  const dispatch = useDispatch();
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [modalData, setModalData] = useState({
    showConfirmModal: false,
    itemToRemove: null,
  });
  const { data: fetchedData, loading } = useFetch(`/products/${item_id}`);
  const product = fetchedData.data;
  const { fetchCartItems } = useCart();

  const handleAddToCart = useCallback(
    async (item) => {
      if (isLoggedIn) {
        dispatch(addToCart({ email: loggedInEmail, item }));
        try {
          await addToCartInFirestore(auth.currentUser.uid, item);
          console.log("Product added to cart!");
        } catch (error) {
          console.log("Failed to add product to the cart.");
          toast.error("Failed to add product to the cart.", {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
        fetchCartItems();
      } else {
        toast.error("Please login to add the product to the cart.", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    },
    [isLoggedIn, loggedInEmail, dispatch, fetchCartItems]
  );

  const { fetchWishlistItems } = useWishlist();
  const handleToggleWishlist = useToggleWishlist(fetchWishlistItems);

  const handleDelete = async (itemId) => {
    try {
      await axios.delete(`${BASE_URL}/products/${itemId}`);
      console.log(`Product deleted successfully with itemId:-${itemId}`);
      showSuccess();
    } catch (error) {
      console.error("Failed to delete product: ", error);
    }
  };

  const hideSuccess = () => {
    setShowSuccessToast(false);
  };

  const showSuccess = () => {
    setShowSuccessToast(true);
  };

  return (
    <>
      <NavbarComponent />
      <br />
      {loading ? (
        <Card>
        <Card.Body>
          <Placeholder as={Card.Title} animation="glow">
            <Placeholder xs={12} />
          </Placeholder>
          <Placeholder as={Card.Text} animation="glow">
            <Placeholder xs={12} /> 
            <Placeholder xs={12} />
            <Placeholder xs={6}/> 
          </Placeholder>
          {isAdmin ? (
            <Placeholder.Button variant="danger" xs={12} />
          ):(
            <Placeholder.Button variant="warning" xs={12} />
          )}
        </Card.Body>
      </Card>
      ) : (
        <Card
          style={{
            margin: "0 auto",
            width: "95%",
            border: "1px solid black",
            borderRadius: "25px",
          }}
        >
          {isAdmin ? (
            <div></div>
          ) : (
            <WishlistIcon
              item={product}
              onToggleWishlist={() => handleToggleWishlist(product)}
            />
          )}
          <Row>
            <Col md={4}>
              <LazyLoadImage
                src={product.image}
                alt={product.title}
                effect="blur"
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
                  {isAdmin ? (
                    <Button
                      variant="danger"
                      style={{ width: "300px" }}
                      onClick={() => {
                        setModalData({
                          showConfirmModal: true,
                          itemToRemove: product.id,
                        });
                      }}
                    >
                      Delete Product
                    </Button>
                  ) : (
                    <Button
                      variant="warning"
                      style={{ width: "300px" }}
                      onClick={() => handleAddToCart(product)}
                    >
                      Add To Cart
                    </Button>
                  )}
                </div>
              </Card.Body>
            </Col>
          </Row>
        </Card>
      )}
      <br></br>

      <CustomModal
        show={modalData.showConfirmModal}
        onHide={() =>
          setModalData({
            showConfirmModal: false,
            itemToRemove: null,
          })
        }
        title="Confirm Delete"
        body="Are you sure you want to Delete this Product ?"
        onCancel={() =>
          setModalData({
            showConfirmModal: false,
            itemToRemove: null,
          })
        }
        onConfirm={() => {
          handleDelete(modalData.itemToRemove);
          setModalData({
            showConfirmModal: false,
            itemToRemove: null,
          });
        }}
      />

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
        <Toast.Body>Product Deleted Successfully</Toast.Body>
      </Toast>
      <ToastContainer autoClose={2000} />
    </>
  );
};

export default Product;
