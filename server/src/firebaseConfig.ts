import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCOS9wXt1LNDDO1VNr9PE3c70iwZp_dxZw",
  authDomain: "node-firebase-a0cd0.firebaseapp.com",
  projectId: "node-firebase-a0cd0",
  storageBucket: "node-firebase-a0cd0.appspot.com",
  messagingSenderId: "357643154115",
  appId: "1:357643154115:web:c64240eb3e938a68cba876",
  measurementId: "G-SMJ5TEK3XV",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
