import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  connectAuthEmulator,
  sendPasswordResetEmail,
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
  const localIp = "192.168.1.108";
  connectFirestoreEmulator(db, localIp, 8081);
  connectAuthEmulator(auth, `http://${localIp}:9099`);
  connectFunctionsEmulator(functions, localIp, 5001);
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

export async function resetPassword(email) {
  sendPasswordResetEmail(auth, email)
    .then(() => {
      return {
        success: true,
      };
    })
    .catch(() => {
      return {
        success: false,
      };
      // ..
    });
}

export const tenantSignup = httpsCallable(functions, "signUpTenant");
export const landlordSignup = httpsCallable(functions, "signUpLandlord");
export const sendMessage = httpsCallable(functions, "sendMessage");
export const reportEmergency = httpsCallable(functions, "reportEmergency");
