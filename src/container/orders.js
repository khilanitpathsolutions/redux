import React, { useEffect, useState } from "react";
import NavbarComponent from "../components/navbar";
import { firestore } from "../services/firebase";
import {collectionGroup,query,getDocs,deleteDoc,doc,updateDoc,} from "firebase/firestore";
import {Table,Container,Row,Col,Spinner,Button,Alert,} from "react-bootstrap";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [orderStatuses, setOrderStatuses] = useState({});
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [updatedOrderStatuses, setUpdatedOrderStatuses] = useState({});

  useEffect(() => {
    const ordersQuery = query(collectionGroup(firestore, "userOrders"));

    const fetchOrdersFromFirestore = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(ordersQuery);
        const allOrders = [];

        querySnapshot.forEach((doc) => {
          allOrders.push(doc.data());
        });
        setOrders(allOrders);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching Orders items:", error?.message);
        throw error;
      }
    };

    const fetchOrderStatusesFromFirestore = async () => {
      try {
        const querySnapshot = await getDocs(ordersQuery);
        const orderStatusData = {};

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          orderStatusData[data.orderId] = data.orderStatus;
        });

        setOrderStatuses(orderStatusData);
      } catch (error) {
        console.error("Error fetching Order statuses:", error.message);
      }
    };

    fetchOrdersFromFirestore();
    fetchOrderStatusesFromFirestore();
  }, []);

  const handleOrderStatusChange = (event, orderId) => {
    const newStatus = event.target.value;
    setUpdatedOrderStatuses((prevOrderStatuses) => ({
      ...prevOrderStatuses,
      [orderId]: newStatus,
    }));
  };

  const saveOrderStatusChanges = async (userId, orderId) => {
    try {
      const newStatus = updatedOrderStatuses[orderId];
      const orderDocRef = doc(firestore,"orders",userId,"userOrders",orderId);
      await updateDoc(orderDocRef, {
        orderStatus: newStatus,
      });

      setOrderStatuses((prevOrderStatuses) => ({
        ...prevOrderStatuses,
        [orderId]: newStatus,
      }));

      setShowSuccessAlert(true);
      setUpdatedOrderStatuses((prevOrderStatuses) => {
        const updatedStatuses = { ...prevOrderStatuses };
        delete updatedStatuses[orderId];
        return updatedStatuses;
      });
      console.log("Order Status Changed Successfully");
      setTimeout(() => {
        setShowSuccessAlert(false);
      }, 3000);
    } catch (error) {
      console.error("Error updating order status:", error.message);
    }
  };

  const handleDeleteOrder = async (userId, orderId) => {
    try {
      console.log("Deleting order with ID:", orderId);
      console.log("User ID:", userId);
      const orderDocRef = doc(
        firestore,
        "orders",
        userId,
        "userOrders",
        orderId
      );
      await deleteDoc(orderDocRef);

      setOrders((prevOrders) =>
        prevOrders.filter((order) => order.orderId !== orderId)
      );
      setShowSuccessAlert(true);
      console.log("Order deleted successfully.");
      setTimeout(() => {
        setShowSuccessAlert(false);
      }, 3000);
    } catch (error) {
      console.error("Error deleting order:", error.message);
    }
  };

  return (
    <>
      <NavbarComponent />
      {loading ? (
        <div className="d-flex justify-content-center align-items-center h-100">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <Container style={{ maxWidth: "100%" }}>
          <div className="d-flex justify-content-center">
            <h1>Orders</h1>
          </div>
          <Row>
            <Col>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Order ID</th>
                    <th>User</th>
                    <th>Product Images</th>
                    <th>Address</th>
                    <th>Order Date</th>
                    <th>Order Amount</th>
                    <th>Payment Method</th>
                    <th>Order Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, index) => (
                    <tr key={order.orderId}>
                      <td>{index + 1}</td>
                      <td>{order.orderId}</td>
                      <td>{order.email}</td>
                      <td>
                        <div className="image-container d-flex justify-content-center">
                          {order.items.map((item) => (
                            <img
                              key={item.id}
                              src={item.image}
                              alt="error"
                              style={{ height: "50px", width: "50px" }}
                            />
                          ))}
                        </div>
                      </td>
                      <td>
                        {order.shippingAddress.address},
                        {order.shippingAddress.city},
                        {order.shippingAddress.state},
                        {order.shippingAddress.phoneNumber}
                      </td>
                      <td>
                        {new Date(
                          order.timestamp.seconds * 1000 +
                            order.timestamp.nanoseconds / 1000000
                        ).toLocaleDateString()}
                      </td>

                      <td>{order.totalAmount} ₹</td>
                      <td>{order.paymentMethod === "UPI" ? "UPI" : "Card"}</td>
                      <td>
                        <select
                          value={
                            updatedOrderStatuses[order.orderId] ||
                            orderStatuses[order.orderId] ||
                            ""
                          }
                          onChange={(e) =>
                            handleOrderStatusChange(e, order.orderId)
                          }
                        >
                          <option value=""></option>
                          <option value="Delivered">Delivered</option>
                          <option value="Pending">Pending</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </td>
                      <td>
                        <Button
                          variant="danger"
                          onClick={() =>
                            handleDeleteOrder(order.userId, order.orderId)
                          }
                        >
                          delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>
          </Row>
        </Container>
      )}
      <div className="d-flex justify-content-center">
        <Button
          variant="dark"
          onClick={() => {
            for (const order of orders) {
              saveOrderStatusChanges(order.userId, order.orderId);
            }
          }}
        >
          Save Changes
        </Button>
      </div>
      {showSuccessAlert && (
        <Alert
          variant="success"
          className="position-fixed top-0 end-0 m-4"
          style={{ zIndex: "9999" }}
        >
          Order status saved successfully!
        </Alert>
      )}
    </>
  );
};

export default Orders;
