import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/messaging";
import { getFirebaseConfig } from "@/helpers/functionHelpers";

// Singleton pattern to ensure Firebase is initialized only once
let firebaseApp = null;

const initializeFirebase = () => {
  if (!firebaseApp) {
    const config = getFirebaseConfig();

    if (config && config !== false) {
      // Check if config is valid
      try {
        firebaseApp = firebase.initializeApp(config);
      } catch (error) {
        console.error("Error initializing Firebase:", error);
        window.location.href = "/";
      }
    } else {
      console.log("Firebase configuration is not available or invalid.");
    }
  }
  return firebaseApp;
};

const FirebaseData = () => {
  initializeFirebase();

  // Ensure that Firebase is properly initialized before accessing services
  if (!firebaseApp) {
    console.log("Firebase not initialized.");
    window.location.href = "/";
    return false;
  }

  const auth = firebase.auth();
  const googleProvider = new firebase.auth.GoogleAuthProvider();
  const messaging = firebase.messaging();
  const facebookProvider = new firebase.auth.FacebookAuthProvider();

  return { auth, googleProvider, facebookProvider, firebase, messaging };
};

export default FirebaseData;
