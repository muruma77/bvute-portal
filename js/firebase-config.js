const firebaseConfig = {
  apiKey: "AIzaSyDi-fHhHUHv2zy3lhbQJH4fEf8CeV6HRA0",
  authDomain: "bvute-primary-school.firebaseapp.com",
  projectId: "bvute-primary-school",
  storageBucket: "bvute-primary-school.firebasestorage.app",
  messagingSenderId: "505767882741",
  appId: "1:505767882741:web:3cc5892a2c7673ebd2fabc"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();
