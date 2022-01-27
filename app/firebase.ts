import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCPg7xBaBXak7AemgAgge4ER4DZ41zuuqA",
  authDomain: "roomr-2022.firebaseapp.com",
  projectId: "roomr-2022",
  storageBucket: "roomr-2022.appspot.com",
  messagingSenderId: "988138097951",
  appId: "1:988138097951:web:59753fe2cbcefc4ad6342a",
};

initializeApp(firebaseConfig);
export const db = getFirestore();
export const auth = getAuth();

export async function login(email, password) {
  // loginUser(auth, email, password);
  try {
    await signInWithEmailAndPassword(auth, email, password);
    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: error.code,
    };
  }
}

export async function registerFakeTenant() {
  const email = "test@test.com";
  const password = "testpassword";
  registerUser(auth, email, password);
}

export async function logout() {
  signOut(auth).catch((error) => {
    console.log(error);
  });
}

async function registerUser(auth, email, password) {
  createUserWithEmailAndPassword(auth, email, password).catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    if (errorCode == "auth/email-already-in-use") {
      login(email, password);
    } else {
      console.log({ errorCode, errorMessage });
    }
  });
  return;
}
