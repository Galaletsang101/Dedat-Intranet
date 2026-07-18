import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail
} from "firebase/auth";

import {
  doc,
  setDoc,
  serverTimestamp
} from "firebase/firestore";

import { auth, db } from "../firebase/firebase";


// LOGIN

export async function loginUser(email, password) {

  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );

  return userCredential.user;

}



// SIGN UP

export async function registerUser(
  email,
  password,
  userData
) {

  const userCredential =
    await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );


  const user = userCredential.user;


  await setDoc(
    doc(db, "users", user.uid),
    {

      ...userData,

      email: email,

      role: "Employee",

      createdDate: serverTimestamp()

    }
  );


  return user;

}



// RESET PASSWORD

export async function resetPassword(email){

  await sendPasswordResetEmail(
    auth,
    email
  );

}