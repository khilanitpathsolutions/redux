import React, { useState, useEffect } from "react";
import {Card,Button,Form,Container,Row,Col,ListGroup,} from "react-bootstrap";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import altImage from "../assets/profile.png";
import NavbarComponent from "../components/navbar";
import { uploadProfilePhoto } from "../services/firebase";

const Profile = () => {
  const auth = getAuth();
  const db = getFirestore();
  const [formData, setFormData] = useState({
    displayName: "",
    email: auth.currentUser?.email || "",
    phoneNumber: "",
    uid: auth.currentUser?.uid || "",
  });
  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [selectedMenuItem, setSelectedMenuItem] = useState("profile");

  const fetchUserData = async () => {
    if (auth.currentUser) {
      const userDocRef = doc(db, "users", auth.currentUser.uid);
      try {
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          setFormData((prevData) => ({
            ...prevData,
            ...docSnap.data(),
          }));
        } else {
          console.log("User document does not exist.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
  };

  useEffect(() => {
  fetchUserData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  const handleProfileUpdate = async () => {
    const userDocRef = doc(db, "users", auth.currentUser.uid);

    try {
      let newPhotoURL = formData.photoURL;

      if (formData.newProfilePhoto) {
        const downloadURL = await uploadProfilePhoto(
          auth.currentUser.uid,
          formData.newProfilePhoto
        );
        newPhotoURL = downloadURL;
      }

      const updatedData = {
        displayName: formData.displayName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        uid: formData.uid,
        photoURL: newPhotoURL,
      };

      await updateDoc(userDocRef, updatedData);

      alert("Profile updated successfully");
      console.log("Profile updated successfully.");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New Password and Confirm Password do not match.");
      return;
    }
    try {
    } catch (error) {
      console.error("Error changing password:", error);
    }
  };

  if (!auth.currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <NavbarComponent />
      <br></br>
      <Container>
        <Row>
          <Col md={3}>
            <ListGroup>
              <ListGroup.Item
                active={selectedMenuItem === "profile"}
                onClick={() => setSelectedMenuItem("profile")}
                style={{ cursor: "pointer" }}
              >
                Profile
              </ListGroup.Item>
              <ListGroup.Item
                active={selectedMenuItem === "changePassword"}
                onClick={() => setSelectedMenuItem("changePassword")}
                style={{ cursor: "pointer" }}
              >
                Change Password
              </ListGroup.Item>
            </ListGroup>
          </Col>
          <Col md={9}>
            <Card>
              <Card.Body>
                <div className="text-center">
                  <img
                    src={formData.photoURL || altImage}
                    alt="Profile"
                    fluid
                    rounded
                    style={{ maxWidth: "150px" }}
                    onError={(e) => {
                      e.target.src = altImage;
                    }}
                  />
                </div>
                {selectedMenuItem === "profile" && (
                  <Form>
                    <Form.Group>
                      <Form.Label>Profile Photo:</Form.Label>
                      <Form.Control
                        type="file"
                        name="newProfilePhoto"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          setFormData((prevData) => ({
                            ...prevData,
                            newProfilePhoto: file,
                          }));
                        }}
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Name:</Form.Label>
                      <Form.Control
                        type="text"
                        name="displayName"
                        value={formData.displayName || ""}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Email:</Form.Label>
                      <Form.Control
                        type="text"
                        name="email"
                        value={formData.email}
                        disabled
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Phone Number:</Form.Label>
                      <Form.Control
                        type="text"
                        name="phoneNumber"
                        value={formData.phoneNumber || ""}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>UID:</Form.Label>
                      <Form.Control
                        type="text"
                        name="uid"
                        value={formData.uid}
                        disabled
                      />
                    </Form.Group>
                    <div className="text-center mt-3">
                      <Button variant="primary" onClick={handleProfileUpdate}>
                        Save Profile
                      </Button>
                    </div>
                  </Form>
                )}
                {selectedMenuItem === "changePassword" && (
                  <div>
                    <Form.Group>
                      <Form.Label>New Password:</Form.Label>
                      <Form.Control
                        type="password"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordInputChange}
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Confirm Password:</Form.Label>
                      <Form.Control
                        type="password"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordInputChange}
                      />
                    </Form.Group>
                    <div className="text-center mt-3">
                      <Button variant="primary" onClick={handlePasswordChange}>
                        Save Changes
                      </Button>
                    </div>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Profile;
