// 1) Replace these values with your Firebase project's Web App config.
// 2) Add your own Firebase Auth UID to ADMIN_UIDS in BOTH app.js and firestore.rules.
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAGIhMkKsVKBVncJA9VCxxgVUgsu-XFPZM",
  authDomain: "turjo-panel-shop.firebaseapp.com",
  projectId: "turjo-panel-shop",
  storageBucket: "turjo-panel-shop.firebasestorage.app",
  messagingSenderId: "931179986332",
  appId: "1:931179986332:web:8e797d1b056fe9e040dc59",
  measurementId: "G-FJR2TDD8TM"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();
