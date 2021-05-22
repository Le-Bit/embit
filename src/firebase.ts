import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyBHA-CLBOqiwPWGtDcFNAqkwneFn4gSdko",
  authDomain: "embit-dev.firebaseapp.com",
  projectId: "embit-dev",
  storageBucket: "embit-dev.appspot.com",
  messagingSenderId: "494170666445",
  appId: "1:494170666445:web:c353c20c05ff02a4910084",
};

export const Firebase = firebase.initializeApp(firebaseConfig);
export const db = Firebase.firestore();
export const auth = firebase.auth();
export const functions = firebase.functions();

if (process.env.NODE_ENV === "development") {
  auth.useEmulator("http://localhost:9099");
  db.useEmulator("localhost", 8081);
  functions.useEmulator("localhost", 5001);
}
