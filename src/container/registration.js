import React, { useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../store/userSlice';
import { Link, useNavigate } from 'react-router-dom';

const RegistrationPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const registeredUsers = useSelector((state) => state.user.registeredUsers);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRegister = () => {
    const { username, password } = formData;

    if (!username || !password) {
      alert('Username and password are required');
      return;
    }

    const isUsernameTaken = registeredUsers.some(
      (user) => user.username === username
    );

    if (isUsernameTaken) {
      alert('Username already taken');
    } else {
      dispatch(register(formData));
      navigate('/login');
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <div style={{ maxWidth: '400px', width: '100%',border: '2px solid black',borderRadius: '25px',padding: '12px' }}>
        <h2 className="text-center mb-4">Registration</h2>
        <Form>
          <Form.Group controlId="username">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              name="username"
              placeholder="Enter username"
              value={formData.username}
              onChange={handleInputChange}
              className="custom-input"
            />
          </Form.Group>
          <Form.Group controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              className="custom-input"
            />
          </Form.Group>
          <Form.Group controlId="confirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="custom-input"
            />
          </Form.Group><br></br>
          <Button variant="primary" onClick={handleRegister} className="w-100">
            Register
          </Button>
          <Link to="/" className="d-block text-center mt-3">Home</Link>
        </Form>
      </div>
    </Container>
  );
};

export default RegistrationPage;
