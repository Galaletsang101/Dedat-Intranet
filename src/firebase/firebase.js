import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyAG0ntFFMtmTYmqap7mpwN_SLbsjCQ4wwM",
  authDomain: "dedat-internal-website.firebaseapp.com",
  projectId: "dedat-internal-website",
  storageBucket: "dedat-internal-website.firebasestorage.app",
  messagingSenderId: "526155760957",
  appId: "1:526155760957:web:01ad4527e2644e900ff154",
  measurementId: "G-B0V7ESRTPL"
};


const app = initializeApp(firebaseConfig);


export const auth = getAuth(app);

export const db = getFirestore(app);