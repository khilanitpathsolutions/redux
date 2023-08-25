import React, { useState } from "react";
import { Alert, Button, Container, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../store/reducers/userSlice";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { validationSchemaLogin } from "../utils/validation";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const registeredUsers = useSelector((state) => state.user.registeredUsers);
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchemaLogin,
    onSubmit: (values) => {
      setLoading(true);

      setTimeout(() => {
        const user = registeredUsers.find(
          (user) =>
            user.email === values.email && user.password === values.password
        );

        if (user) {
          dispatch(login({ email: user.email }));
          navigate("/");
        } else {
          setShowAlert(true);
        }

        setLoading(false);
      }, 3000);
    },
  });

  return (
    <>
      {showAlert && (
        <Alert variant="danger" onClose={() => setShowAlert(false)} dismissible>
          Invalid email or password.
        </Alert>
      )}
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <div
          style={{
            maxWidth: "400px",
            width: "100%",
            border: "2px solid black",
            borderRadius: "25px",
            padding: "12px",
          }}
        >
          <h2 className="text-center mb-4">Login</h2>
          <form onSubmit={formik.handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-control"
                {...formik.getFieldProps("email")}
              />
              {formik.touched.email && formik.errors.email && (
                <div className="text-danger">{formik.errors.email}</div>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="form-control"
                {...formik.getFieldProps("password")}
              />
              {formik.touched.password && formik.errors.password && (
                <div className="text-danger">{formik.errors.password}</div>
              )}
            </div>
            <Button
              variant="primary"
              type="submit"
              className="w-100"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" /> Logging in...
                </>
              ) : (
                "Login"
              )}
            </Button>
            <Link
              to="/"
              className="d-block text-center mt-3 text-decoration-none"
            >
              Home
            </Link>
            <Link
              to="/register"
              className="d-block text-center mt-3 text-decoration-none"
            >
              Not Registered? Click Here
            </Link>
          </form>
        </div>
      </Container>
    </>
  );
};

export default LoginPage;
