<<<<<<< Updated upstream
firebase.initializeApp({
    apiKey: "AIzaSyCJAwDYwDnW_uX8KOSQuz7SIAGJscBc_QU",
    authDomain: "secondbyte33.firebaseapp.com",
    projectId: "secondbyte33",
    storageBucket: "secondbyte33.firebasestorage.app",
    messagingSenderId: "707492674406",
    appId: "1:707492674406:web:e9255b69b12808bf3ae6a7"
});

const auth = firebase.auth();
=======
// Configuración de Firebase (Asegúrate de tener tus credenciales aquí)
const firebaseConfig = {
    apiKey: "AIzaSyCJAwDYwDnW_uX8KOSQuz7SIAGJscBc_QU",
  authDomain: "secondbyte33.firebaseapp.com",
  projectId: "secondbyte33",
  storageBucket: "secondbyte33.firebasestorage.app",
  messagingSenderId: "707492674406",
  appId: "1:707492674406:web:e9255b69b12808bf3ae6a7"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const auth           = firebase.auth();
const db             = firebase.firestore();
const storage        = firebase.storage();

// Referencias Globales (Asegúrate de que todas estén presentes)
const users          = db.collection("usuaris");
const components     = db.collection("components");
const guias          = db.collection("guias");
const transaccions   = db.collection("transaccions");
const valoracions    = db.collection("valoracions");
const certificacions = db.collection("certificacions");
const products       = db.collection("products"); // Añadida para evitar errores en products.js
>>>>>>> Stashed changes
