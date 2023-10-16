import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../store/reducers/cartSlice";
import { toggleTheme } from "../store/reducers/themeSlice";
import { Container, Row, Col, Card, Button, Spinner, DropdownButton, Dropdown, Form, Toast } from "react-bootstrap";
import NavbarComponent from "../components/navbar";
import ImageSwiper from "../components/swiper";
import { useNavigate } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import WishlistIcon from "../components/wishlistIcon";
import useToggleWishlist from "../hooks/useToggleWishlist";
import { addToCartInFirestore, auth } from "../services/firebase";
import { useWishlist } from "../utils/wishlistContext";
import { useCart } from "../utils/cartContext";
import { Helmet } from "react-helmet-async";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import "../index.css";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import CustomModal from "../components/modal";

  const Home = () => {
  const dispatch = useDispatch(); 
  const theme = useSelector((state) => state.theme);
  const loggedInEmail = useSelector((state) => state.user.loggedInEmail);
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const navigate = useNavigate();
  const { fetchCartItems } = useCart();
  const [isLoading, setIsLoading] = useState(true);
  const userRole = useSelector((state) => state.user.userRole);
  const isAdmin = userRole === "admin";
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const { data: fetchedData, loading } = useFetch("/products");
  const { fetchWishlistItems } = useWishlist();
  const handleToggleWishlist = useToggleWishlist(fetchWishlistItems);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [modalData, setModalData] = useState({
    showConfirmModal: false,
    itemToRemove: null
  });
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const hideSuccess = () => {
    setShowSuccessToast(false);
  };

  const showSuccess = () => {
    setShowSuccessToast(true)
  }
  const themeStyles = {
    light: {
      backgroundColor: "#e3e3e3",
      textColor: "black",
    },
    dark: {
      backgroundColor: "#333",
      textColor: "white",
    },
  };

  useEffect(() => {
    setIsLoading(loading);
  }, [loading]);

  const products = fetchedData?.data || [];

  const debounce = (func, delay) => {
    let timeoutId;
    return function () {
      const context = this;
      const args = arguments;
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(context, args);
      }, delay);
    };
  };

  const debouncedFilter = useCallback(
    debounce((query) => {
      setSearchQuery(query);
      console.log("Debounce Called")
    }, 500),
    []
  );
  
    const handleSearchInputChange = (e) => {
    const query = e.target.value;
    setDebouncedSearchQuery(query);
    debouncedFilter(query); 
  };

  const handleViewProduct = useCallback(
    (itemId) => {
      navigate(`/product/${itemId}`);
    },
    [navigate]
  );

  const handleAddProduct = useCallback(() => {
    if (isLoggedIn) {
      navigate("/addproduct");
    } else {
      alert("Please Login to Add a product to the Store");
    }
  }, [isLoggedIn, navigate]);

  const handleSortOrderChange = (newSortOrder) => {
    setSortOrder(newSortOrder);
  };

  const handleFilterCategory = (category) => {
    setSelectedCategories((prevSelected) => {
      if (prevSelected.includes(category)) {
        return prevSelected.filter((item) => item !== category);
      } else {
        return [...prevSelected, category];
      }
    });
  };

  const isCategorySelected = (category) => {
    return selectedCategories.includes(category);
  };

  const handleAddToCart = useCallback(
    async (item) => {
      if (isLoggedIn) {
        dispatch(addToCart({ email: loggedInEmail, item }));
        try {
          await addToCartInFirestore(auth.currentUser.uid, item);
          console.log("Product added to cart!");
        } catch (error) {
          console.log("Failed to add product to the cart.");
        }
        fetchCartItems();
      } else {
        alert("Please login to add the product to the cart.");
      }
    },
    [isLoggedIn, loggedInEmail, dispatch, fetchCartItems]
  );

  const filteredProducts = products
  .filter(
    (item) =>
      item.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
      item.price.toString().toLowerCase().includes(debouncedSearchQuery.toLowerCase())
  )
    .filter((item) =>
      selectedCategories.length === 0
        ? true
        : selectedCategories.includes(item.category)
    )
    .sort((a, b) => {
      if (sortOrder === "asc") {
        return a.price - b.price;
      } else {
        return b.price - a.price;
      }
    });
    const uniqueCategories = [...new Set(products.map((item) => item.category))];

    const handleDelete = async (itemId) => {
      try {
        await axios.delete(`${BASE_URL}/products/${itemId}`);
        console.log(`Product deleted successfully with itemId:-${itemId}`);
        showSuccess();
      } catch (error) {
        console.error("Failed to delete product: ", error);
      }
    };
    
  return (
    <>
      <Helmet>
        <title>Redux-Store</title>
        <meta
          name="description"
          content="E-commerce Site Created Using React JS and Redux Toolkit"
        />
      </Helmet>
      <div
        style={{
          ...themeStyles[theme],
          minHeight: "100vh",
          color: themeStyles[theme].textColor,
        }}
      >
        <NavbarComponent />
        <ImageSwiper />
        {isLoading ? (
          <div className="d-flex justify-content-center align-items-center h-100">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <Container className="my-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
              {isAdmin && (
                <Button variant="secondary" onClick={handleAddProduct}>
                  ADD Products
                </Button>
              )}

              <DropdownButton
                variant="dark"
                title={
                  selectedCategories.length === 0
                    ? "All Categories"
                    : selectedCategories.join("+")
                }
              >
                <Dropdown.Item
                  key="All"
                  active={selectedCategories.length === 0}
                  onClick={() => setSelectedCategories([])}
                >
                  All Categories
                </Dropdown.Item>
                <Dropdown.Divider />
                {uniqueCategories.map((category) => (
                  <Dropdown.Item
                    key={category}
                    active={isCategorySelected(category)}
                    onClick={() => handleFilterCategory(category)}
                  >
                    <Form.Check
                      type="checkbox"
                      label={category}
                      checked={isCategorySelected(category)}
                    />
                  </Dropdown.Item>
                ))}
              </DropdownButton>

              <DropdownButton
                variant="info"
                title={`Sort ${
                  sortOrder === "asc" ? "Low to High" : "High to Low"
                }`}
              >
                <Dropdown.Item onClick={() => handleSortOrderChange("asc")}>
                  Low to High
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleSortOrderChange("desc")}>
                  High to Low
                </Dropdown.Item>
              </DropdownButton>

              <input
                placeholder="Search..."
                value={searchQuery}
                onChange={handleSearchInputChange}
                style={{
                  border: "1px solid black",
                  borderRadius: "10px",
                  width: "25%",
                  height: "35px",
                  fontSize: "20px",
                }}
              ></input>

              <Button onClick={() => dispatch(toggleTheme())} variant="primary">
                Toggle Theme
              </Button>
            </div>

            <Row xs={1} sm={2} md={3} lg={4} className="g-4">
              {filteredProducts.map((item) => (
                <Col key={item.id}>
                  <Card style={{ height: "100%", borderRadius: "20px" }}>
                  {isAdmin ? (<div></div>):(
                      <WishlistIcon
                      item={item}
                      onToggleWishlist={() => handleToggleWishlist(item)}
                    />
                  )}
                    <div
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <LazyLoadImage
                        variant="top"
                        src={item.image}
                        effect="blur"
                        alt="error"
                        style={{
                          width: "220px",
                          height: "220px",
                          padding: "10px",
                          cursor: "pointer",
                        }}
                        onClick={() => handleViewProduct(item.id)}
                      />
                    </div>
                    <Card.Body className="d-flex flex-column">
                      <Card.Title className="text-truncate">
                        {item?.title}
                      </Card.Title>
                      <Card.Text className="h6 text-truncate">
                        {item?.description}
                      </Card.Text>
                      <Card.Text className="h5">
                        Category: {item?.category}
                      </Card.Text>
                      <Card.Text className="h3">
                        Price: {item?.price} ₹
                      </Card.Text>
                      <Card.Text>
                        Rating: {item?.rating?.rate}⭐ Rated By: (
                        {item?.rating?.count} Users)
                      </Card.Text>
                    </Card.Body>
                    {isAdmin ? (
                  <>
                    <Button variant="primary" style={{ margin: "5px" }}>
                      Edit
                    </Button>
                    <Button variant="danger" style={{ margin: "5px" }}  onClick={() => {
                              setModalData({
                                showConfirmModal: true,
                                itemToRemove: item.id
                              });
                            }}>
                      Delete
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="primary" style={{ margin: "5px" }}>
                      Buy Now
                    </Button>
                    <Button
                      onClick={() => handleAddToCart(item)}
                      variant="warning"
                      style={{ margin: "5px" }}
                    >
                      ADD TO CART
                    </Button>
                  </>
                )}
                  </Card>
                </Col>
              ))}
            </Row>
          </Container>
        )}
        <div style={{ display: "flex", justifyContent: "end", margin: "5px" }}>
          <Button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            ↑
          </Button>
        </div>
        <hr />
      </div>

 {/* pop-up modals */}
 
      <CustomModal
        show={modalData.showConfirmModal}
        onHide={() =>
          setModalData({
            showConfirmModal: false,
            itemToRemove: null
          })
        }
        title="Confirm Delete"
        body="Are you sure you want to Delete this Product ?"
        onCancel={() =>
          setModalData({
            showConfirmModal: false,
            itemToRemove: null
          })
        }
        onConfirm={() => {
          handleDelete(modalData.itemToRemove);
          setModalData({
            showConfirmModal: false,
            itemToRemove: null
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
    </>
  );
};

export default Home;
