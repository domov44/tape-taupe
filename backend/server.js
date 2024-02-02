const express = require('express');
const cors = require('cors');
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');

const app = express();
app.use(cors());
app.use(express.json()); // Ajout du middleware pour parser le JSON dans les requêtes

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
const auth = getAuth(firebaseApp);

if (db) {
  console.log("Connexion à Firebase établie avec succès!");
} else {
  console.error("Erreur lors de la connexion à Firebase.");
}

// Middleware global pour les en-têtes CORS
app.use((req, res, next) => {
  const allowedOrigins = ['https://tape-taupe.vercel.app', 'http://localhost:5500'];
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});


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

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    res.status(200).json({ uid: user.uid, email: user.email });
  } catch (error) {
    console.error('Erreur lors de la connexion utilisateur', error);
    res.status(401).send('Identifiants invalides');
  }
});

const port = process.env.PORT || 8081;

app.listen(port, () => {
  console.log(`Le serveur back tourne correctement sur le port ${port}`);
});
