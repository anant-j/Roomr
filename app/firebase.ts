import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { doc, arrayUnion, updateDoc } from "firebase/firestore";

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
