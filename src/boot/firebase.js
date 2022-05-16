import firebase from "firebase/app"
import "firebase/firestore"

import { initializeApp } from 'firebase/app';
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDCU03X0cN71w4tsdf5iPWpvw9xp6tsYMc",
  authDomain: "twitter-8360e.firebaseapp.com",
  projectId: "twitter-8360e",
  storageBucket: "twitter-8360e.appspot.com",
  messagingSenderId: "815697369908",
  appId: "1:815697369908:web:6c01befc989eaaec932361"
};

const app = initializeApp(firebaseConfig);
// let db = getFirestore(app);
let db = getFirestore(app);

export default db