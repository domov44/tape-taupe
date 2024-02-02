// models/firebaseModel.js
const { initializeApp } = require('firebase/app');
const { getFirestore } = require('firebase/firestore');

const firebaseConfig = {
    apiKey: "AIzaSyDQmbuusv0hvy1Mp6wJxnEBiBfv0ex5E30",
    authDomain: "tape-taupe-32863.firebaseapp.com",
    projectId: "tape-taupe-32863",
    storageBucket: "tape-taupe-32863.appspot.com",
    messagingSenderId: "174161939538",
    appId: "1:174161939538:web:f53cae6964f799bca0e38b"
  };

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

module.exports = db;
