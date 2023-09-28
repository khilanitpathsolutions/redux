import * as Yup from 'yup';

export const validationSchemaLogin = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const passwordRules = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$%^&!*])[A-Za-z\d@#$%^&!*]+$/;

 export const validationSchemaRegister = Yup.object({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().matches(passwordRules, { message: "Please create a stronger password" }).required("Password is Required").min(8,'Must be 8 Characters'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm Password is required'),
  });
