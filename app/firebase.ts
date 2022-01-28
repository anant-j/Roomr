import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  connectAuthEmulator,
} from "firebase/auth";
import {
  getFunctions,
  httpsCallable,
  connectFunctionsEmulator,
} from "firebase/functions";
const firebaseConfig = {
  apiKey: "AIzaSyCPg7xBaBXak7AemgAgge4ER4DZ41zuuqA",
  authDomain: "roomr-2022.firebaseapp.com",
  projectId: "roomr-2022",
  storageBucket: "roomr-2022.appspot.com",
  messagingSenderId: "988138097951",
  appId: "1:988138097951:web:59753fe2cbcefc4ad6342a",
};

const app = initializeApp(firebaseConfig);
const localTestMode = false;
export const db = getFirestore();
export const auth = getAuth();
export const functions = getFunctions(app);

if (localTestMode) {
  connectFirestoreEmulator(db, "192.168.1.108", 8081);
  connectAuthEmulator(auth, "http://192.168.1.108:9099");
  connectFunctionsEmulator(functions, "192.168.1.108", 5001);
}

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

export async function logout() {
  signOut(auth).catch((error) => {
    console.log(error);
  });
}

export const tenantSignup = httpsCallable(functions, "signUpTenant");
export const landlordSignup = httpsCallable(functions, "signUpLandlord");
