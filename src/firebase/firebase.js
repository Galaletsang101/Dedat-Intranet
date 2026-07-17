import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: import.meta.env.VITE_BASE_apiKey,
  authDomain: import.meta.env.VITE_BASE_authDomain,
  projectId: import.meta.env.VITE_BASE_projectId,
  storageBucket: import.meta.env.VITE_BASE_storageBucket,
  messagingSenderId: import.meta.env.VITE_BASE_messagingSenderId,
  appId: import.meta.env.VITE_BASE_appId,
  measurementId: import.meta.env.VITE_BASE_measurementId
};


const app = initializeApp(firebaseConfig);


export const auth = getAuth(app);

export const db = getFirestore(app);