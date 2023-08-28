import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyABCaFjpMD_sjYbO3Rol4twEWbgvzlifMc",
  authDomain: "redux-demo-b6443.firebaseapp.com",
  projectId: "redux-demo-b6443",
  storageBucket: "redux-demo-b6443.appspot.com",
  messagingSenderId: "107044157191",
  appId: "1:107044157191:web:0b81456de8ee1600eeb7a2",
  measurementId: "G-12C43E9FX7",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();

const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    console.log(res);
    return res;
  } catch (error) {
    console.log(error.message);
  }
};

const signInWithEmailAndPasswordLocal = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    console.log(userCredential);
    return userCredential;
  } catch (error) {
    console.log(error.message);
    throw error;
  }
};

export {
  app,
  analytics,
  auth,
  signInWithGoogle,
  signInWithEmailAndPasswordLocal as signInWithEmailAndPassword,
};
