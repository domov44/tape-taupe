const express = require('express');
const cors = require('cors');
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');

const app = express();

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

if (db) {
  console.log("Connexion à Firebase établie avec succès!");
} else {
  console.error("Erreur lors de la connexion à Firebase.");
}

app.use(cors({
  origin: 'https://tape-taupe.vercel.app',
  credentials: true,
}));

app.get('/', (req, res) => {
  res.send('Bienvenue sur votre API !');
});

app.get('/data', async (req, res) => {
  try {
    const dataRef = collection(db, 'users');
    const snapshot = await getDocs(dataRef);
    const data = snapshot.docs.map(doc => doc.data());
    res.json(data);
  } catch (error) {
    console.error('Erreur lors de la récupération des données depuis Firestore', error);
    res.status(500).send('Erreur serveur');
  }
});

const port = process.env.PORT || 8081;

app.listen(port, () => {
  console.log(`Le serveur back tourne correctement sur le port ${port}`);
});
