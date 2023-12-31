import React, { useState } from "react";
import { Alert, Button, Container, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, signInWithGoogle } from "../services/firebase";
import { validationSchemaRegister } from "../utils/validation";
import { Google } from "react-bootstrap-icons";
import { login } from "../store/reducers/userSlice";
import { useDispatch } from "react-redux";

const RegistrationPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: validationSchemaRegister,
    onSubmit: async (values) => {
      setLoading(true);

      try {
        const { email, password } = values;
        await createUserWithEmailAndPassword(auth, email, password);
        navigate("/login");
      } catch (error) {
        setShowAlert(true);
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    },
  });

  const handleGoogleLogin = async () => {
    try {
      const res = await signInWithGoogle();
      console.log("Response from signInWithGoogle:", res);
      if (res.user.email) {
        const email = res.user.email;
        console.log("Email from Google:", email);
        console.log("Dispatching login action...");
        dispatch(login({ email }));
        navigate("/");
      } else {
        alert("Failed");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      {showAlert && (
        <Alert variant="danger" onClose={() => setShowAlert(false)} dismissible>
          Registration Failed !! Email id is already used
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
          <h2 className="text-center mb-4">Registration Page</h2>
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
            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className="form-control"
                {...formik.getFieldProps("confirmPassword")}
              />
              {formik.touched.confirmPassword &&
                formik.errors.confirmPassword && (
                  <div className="text-danger">
                    {formik.errors.confirmPassword}
                  </div>
                )}
            </div>
            <div
              className="mb-3"
              style={{
                display: "flex",
                flexDirection: "column",
                rowGap: "15px",
              }}
            >
              <Button
                variant="primary"
                type="submit"
                className="w-100"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" /> Registering...
                  </>
                ) : (
                  "Register"
                )}
              </Button>

              <Button
                className="w-100 d-flex align-items-center justify-content-center "
                style={{columnGap:"10px"}}
                variant="secondary"
                onClick={handleGoogleLogin}
              >
                SignUp With Google <Google />
              </Button>
            </div>
            <Link
              to="/"
              className="d-block text-center mt-3 text-decoration-none"
            >
              Home
            </Link>
          </form>
        </div>
      </Container>
    </>
  );
};

export default RegistrationPage;
