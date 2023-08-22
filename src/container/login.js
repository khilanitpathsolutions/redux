import React, { useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../store/userSlice';
import { Link, useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
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

  const handleLogin = () => {
    const user = registeredUsers.find(
      (user) =>
        user.username === formData.username && user.password === formData.password
    );
  
    if (user) {
      dispatch(login({ username: user.username })); 
      navigate('/');
    } else {
      alert('Invalid username or password.');
    }
  };
  

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <div style={{ maxWidth: '400px', width: '100%',border: '2px solid black',borderRadius: '25px',padding: '12px' }}>
        <h2 className="text-center mb-4">Login</h2>
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
          </Form.Group><br></br>
          <Button variant="primary" onClick={handleLogin} className="w-100">
            Login
          </Button>
          <Link to="/" className="d-block text-center mt-3 text-decoration-none">Home</Link>
          <Link to="/register" className="d-block text-center mt-3 text-decoration-none">Not Registered? Click Here</Link>
        </Form>
      </div>
    </Container>
  );
};

export default LoginPage;
