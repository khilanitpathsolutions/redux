import React, { useState, useEffect } from "react";
import { Card, Button, Form, Container, Row, Col, ListGroup, Spinner } from "react-bootstrap";
import { getAuth, updatePassword } from "firebase/auth";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import altImage from "../assets/profile.png";
import NavbarComponent from "../components/navbar";
import { uploadProfilePhoto } from "../services/firebase";

const Profile = () => {
  const auth = getAuth();
  const db = getFirestore();
  const user = auth.currentUser;
  const [loading, setLoading] = useState(false);
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
  const [selectedProfilePhoto, setSelectedProfilePhoto] = useState(formData.photoURL || altImage);
  const [newProfilePhoto, setNewProfilePhoto] = useState(null);

  const fetchUserData = async () => {
    if (auth.currentUser) {
      const userDocRef = doc(db, "users", auth.currentUser.uid);
      try {
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setFormData((prevData) => ({
            ...prevData,
            ...userData,
          }));
          setSelectedProfilePhoto(userData.photoURL || altImage);
        } else {
          console.log("User document does not exist");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
  };

  useEffect(() => {
    fetchUserData();
    console.log("useEffect running");
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleProfilePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedProfilePhoto(reader.result);
        setNewProfilePhoto(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const fileInputRef = React.createRef(); 

  const handleCancelPhotoChange = () => {
    setSelectedProfilePhoto(formData.photoURL || altImage);
    setNewProfilePhoto(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleProfileUpdate = async () => {
    setLoading(true);
    const userDocRef = doc(db, "users", auth.currentUser.uid);

    try {
      let newPhotoURL = formData.photoURL;

      if (newProfilePhoto) {
        const downloadURL = await uploadProfilePhoto(
          auth.currentUser.uid,
          newProfilePhoto
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
      console.log("Profile updated successfully");
      setLoading(false);
      fetchUserData();
      setSelectedProfilePhoto(newPhotoURL);
      setNewProfilePhoto(null);
    } catch (error) {
      console.error("Error updating profile", error);
    }
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlePasswordChange = async () => {
    setLoading(true);
    const newPassword = passwordData.newPassword;
    if (newPassword !== passwordData.confirmPassword) {
      alert("New Password and Confirm Password do not match");
      return;
    }

    try {
      await updatePassword(user, newPassword);
      alert("Password updated successfully");
      setPasswordData({
        newPassword: '',
        confirmPassword: '',
      });
      setLoading(false);
    } catch (error) {
      console.log("Error changing password", error);
      alert("Error changing password: " + error.message);
    }
  };

  return (
    <div>
      <NavbarComponent />
      <br />
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
                    src={selectedProfilePhoto}
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
                        onChange={handleProfilePhotoChange}
                        ref={fileInputRef}
                      />
                    </Form.Group>
                    {newProfilePhoto && (
                      <div className="text-center mt-2">
                        <Button
                          variant="danger"
                          onClick={handleCancelPhotoChange}
                        >
                          Cancel
                        </Button>
                      </div>
                    )}
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
                        type="number"
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
                      <Button
                        variant="primary"
                        onClick={handleProfileUpdate}
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <Spinner animation="border" size="sm" /> Updating...
                          </>
                        ) : (
                          "Save Profile"
                        )}
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
                      <Button
                        variant="primary"
                        onClick={handlePasswordChange}
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <Spinner animation="border" size="sm" /> Updating...
                          </>
                        ) : (
                          "Update Password"
                        )}
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
