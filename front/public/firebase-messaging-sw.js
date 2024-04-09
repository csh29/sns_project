importScripts("https://www.gstatic.com/firebasejs/8.0.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.0.0/firebase-messaging.js");

const firebaseConfig = {
  apiKey: "AIzaSyCMCPLbkkXCKr6fBVz_z-OpoJmNFEz0rCU",
  authDomain: "sns-project-69568.firebaseapp.com",
  projectId: "sns-project-69568",
  storageBucket: "sns-project-69568.appspot.com",
  messagingSenderId: "53705719063",
  appId: "1:53705719063:web:b18ca3f5d0da0af9bbcb52",
  measurementId: "G-KYJJ27JPEN"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
firebase.messaging();

//const analytics = getAnalytics(app);