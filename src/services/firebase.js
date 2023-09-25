import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth,GoogleAuthProvider,signInWithEmailAndPassword,signInWithPopup,} from "firebase/auth";
import {getFirestore,doc,setDoc,getDoc,collection, serverTimestamp,} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

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
const firestore = getFirestore(app);
const storage = getStorage(app);

const googleProvider = new GoogleAuthProvider();

const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    console.log(res);

    if (res.user) {
      const { email, displayName, photoURL, phoneNumber, uid } = res.user;
      const userRef = doc(firestore, "users", uid);
      const userSnapshot = await getDoc(userRef);

      if (!userSnapshot.exists()) {
        await setDoc(userRef, {
          uid: uid,
          email: email,
          displayName: displayName,
          photoURL: photoURL,
          phoneNumber: phoneNumber,
        });
      }

      return res;
    } else {
      console.log("Failed to get user information from Google response.");
      return null;
    }
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

    const {
      email: userEmail,
      displayName,
      photoURL,
      phoneNumber,
      uid,
    } = userCredential.user;
    const userRef = doc(firestore, "users", uid);
    const userSnapshot = await getDoc(userRef);

    if (!userSnapshot.exists()) {
      await setDoc(userRef, {
        uid: uid,
        email: userEmail,
        displayName: displayName,
        photoURL: photoURL,
        phoneNumber: phoneNumber,
      });
    }

    return userCredential;
  } catch (error) {
    console.log(error.message);
    throw error;
  }
};

const addToCartInFirestore = async (uid, item) => {
  try {
    const cartRef = doc(firestore, "carts", uid);
    const cartSnapshot = await getDoc(cartRef);

    if (cartSnapshot.exists()) {
      const cartData = cartSnapshot.data();
      const existingItems = cartData.items;

      let itemUpdated = false;
      const updatedItems = existingItems.map((existingItem) => {
        if (existingItem.id === item.id) {
          itemUpdated = true;
          return {
            ...existingItem,
            quantity: existingItem.quantity + 1,
          };
        }
        return existingItem;
      });

      if (!itemUpdated) {
        updatedItems.push({ ...item, quantity: 1 });
      }

      const updatedCart = {
        items: updatedItems,
      };
      await setDoc(cartRef, updatedCart);
    } else {
      const newCart = {
        items: [{ ...item, quantity: 1 }],
      };
      await setDoc(cartRef, newCart);
    }
  } catch (error) {
    console.log("Error adding to cart:", error.message);
    throw error;
  }
};

const removeFromCartInFirestore = async (uid, itemId) => {
  try {
    const cartRef = doc(firestore, "carts", uid);
    const cartSnapshot = await getDoc(cartRef);

    if (cartSnapshot.exists()) {
      const cartData = cartSnapshot.data();
      const updatedItems = cartData.items.filter((item) => item.id !== itemId);
      await setDoc(cartRef, { items: updatedItems });
    }
  } catch (error) {
    console.log("Error removing from cart:", error.message);
    throw error;
  }
};

const updateQuantityInFirestore = async (uid, itemId, newQuantity) => {
  try {
    const cartRef = doc(firestore, "carts", uid);
    const cartSnapshot = await getDoc(cartRef);

    if (cartSnapshot.exists()) {
      const cartData = cartSnapshot.data();
      const updatedItems = cartData.items.map((item) => {
        if (item.id === itemId) {
          return { ...item, quantity: newQuantity };
        }
        return item;
      });

      await setDoc(cartRef, { items: updatedItems });
    }
  } catch (error) {
    console.log("Error updating quantity:", error.message);
    throw error;
  }
};

const addToWishlistInFirestore = async (uid, item) => {
  try {
    const wishlistRef = doc(firestore, "wishlists", uid);
    const wishlistSnapshot = await getDoc(wishlistRef);

    if (wishlistSnapshot.exists()) {
      const wishlistData = wishlistSnapshot.data();
      const updatedWishlist = {
        items: [...wishlistData.items, item],
      };
      await setDoc(wishlistRef, updatedWishlist);
    } else {
      const newWishlist = {
        items: [item],
      };
      await setDoc(wishlistRef, newWishlist);
    }
  } catch (error) {
    console.log("Error adding to wishlist:", error.message);
    throw error;
  }
};

const removeFromWishlistInFirestore = async (uid, itemId) => {
  try {
    const wishlistRef = doc(firestore, "wishlists", uid);
    const wishlistSnapshot = await getDoc(wishlistRef);

    if (wishlistSnapshot.exists()) {
      const wishlistData = wishlistSnapshot.data();
      const updatedItems = wishlistData.items.filter(
        (item) => item.id !== itemId
      );
      await setDoc(wishlistRef, { items: updatedItems });
    }
  } catch (error) {
    console.log("Error removing from wishlist:", error.message);
    throw error;
  }
};

const cartsCollection = collection(firestore, "carts");

const fetchCartItemsFromFirestore = async (uid) => {
  try {
    const cartRef = doc(cartsCollection, uid);
    const cartSnapshot = await getDoc(cartRef);
    if (cartSnapshot.exists()) {
      return cartSnapshot.data().items;
    } else {
      return [];
    }
  } catch (error) {
    console.log("Error fetching cart items:", error.message);
    throw error;
  }
};

const wishlistsCollection = collection(firestore, "wishlists");

const fetchWishlistItemsFromFirestore = async (uid) => {
  try {
    const wishlistRef = doc(wishlistsCollection, uid);
    const wishlistSnapshot = await getDoc(wishlistRef);

    if (wishlistSnapshot.exists()) {
      return wishlistSnapshot.data().items;
    } else {
      return [];
    }
  } catch (error) {
    console.log("Error fetching wishlist items:", error.message);
    throw error;
  }
};

const uploadProfilePhoto = async (uid, file) => {
  try {
    const storageRef = ref(storage, `profile-photos/${uid}`);
    await uploadBytes(storageRef, file);

    const downloadURL = await getDownloadURL(storageRef);
    console.log("Downloaded photo URL:", downloadURL);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading profile photo:", error);
    throw error;
  }
};

const addOrderToFirestore = async (userId, orderData) => {
  try {
    const ordersCollection = collection(firestore, "orders");

    const orderRef = doc(ordersCollection);
    await setDoc(orderRef, {
      userId: userId,
      shippingAddress: orderData.shippingAddress,
      paymentMethod: orderData.paymentMethod,
      items: orderData.items,
      subTotal: orderData.subTotal,
      taxes: orderData.taxes,
      totalAmount: orderData.totalAmount,
      timestamp: serverTimestamp(), 
    });

    console.log("Order added successfully!");
  } catch (error) {
    console.error("Error adding order to Firestore:", error);
    throw error;
  }
};
export {
  app,
  analytics,
  auth,
  signInWithGoogle,
  signInWithEmailAndPasswordLocal as signInWithEmailAndPassword,
  addToCartInFirestore,
  removeFromCartInFirestore,
  updateQuantityInFirestore,
  addToWishlistInFirestore,
  removeFromWishlistInFirestore,
  fetchCartItemsFromFirestore,
  fetchWishlistItemsFromFirestore,
  uploadProfilePhoto,
  addOrderToFirestore,
  firestore,
};
