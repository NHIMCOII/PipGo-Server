// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBmUded6ejNQhNnKlgkvg-P4-htL4XtpQg",
  authDomain: "pipgo-chat-app.firebaseapp.com",
  projectId: "pipgo-chat-app",
  storageBucket: "pipgo-chat-app.appspot.com",
  messagingSenderId: "314104029320",
  appId: "1:314104029320:web:3f9fe5d2b3b314cd547f3d",
  measurementId: "G-ERQW2MZDC9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);