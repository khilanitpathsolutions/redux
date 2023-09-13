import { Card, Button, Form } from "react-bootstrap";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import altImage from "../assets/profile.png";
import NavbarComponent from "../components/navbar";

const Profile = () => {
  const auth = getAuth();
  console.log(auth)
  const db = getFirestore();
  const [profileData, setProfileData] = useState({});
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        const userDocRef = doc(db, "users", auth.currentUser.uid);
        try {
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            setProfileData(docSnap.data());
          } else {
            console.log("User document does not exist.");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, [auth.currentUser, db]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleProfileUpdate = async () => {
    const userDocRef = doc(db, "users", auth.currentUser.uid);
    try {
      await updateDoc(userDocRef, {
        ...profileData,
      });

      console.log("Profile updated successfully.");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
    setEditing(false);
  };

  if (!auth.currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <NavbarComponent />
      <h2>Profile</h2>
      <Card>
        <Card.Body>
          <img
            src={auth.currentUser.photoURL || altImage}
            alt="Profile"
            fluid
            rounded
            style={{ maxWidth: "150px" }}
            onError={(e) => {
              e.target.src = altImage;
            }}
          />
          <Form>
            <Form.Group>
              <Form.Label>Name:</Form.Label>
              {editing ? (
                <Form.Control
                  type="text"
                  name="displayName"
                  value={profileData.displayName || ""}
                  onChange={handleInputChange}
                />
              ) : (
                <Form.Control
                className="h2"
                  plaintext
                  readOnly
                  defaultValue={profileData.displayName || ""}
                />
              )}
            </Form.Group>
            <Form.Group>
              <Form.Label>Email:</Form.Label>
              <Form.Control className="h4" plaintext value={auth.currentUser.email} readOnly />
            </Form.Group>
            <Form.Group>
              <Form.Label>Phone Number:</Form.Label>
              {editing ? (
                <Form.Control
                  type="text"
                  name="phoneNumber"
                  value={profileData.phoneNumber || ""}
                  onChange={handleInputChange}
                />
              ) : (
                <Form.Control
                  className="h5"
                  plaintext
                  readOnly
                  defaultValue={profileData.phoneNumber || ""}
                />
              )}
            </Form.Group>
            <Form.Group>
              <Form.Label>UID:</Form.Label>
              <Form.Control className="h4" plaintext value={auth.currentUser.uid} readOnly />
            </Form.Group>
            {editing ? (
              <Button variant="primary" onClick={handleProfileUpdate}>
                Save Profile
              </Button>
            ) : (
              <Button variant="primary" onClick={() => setEditing(true)}>
                Edit Profile
              </Button>
            )}
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Profile;
