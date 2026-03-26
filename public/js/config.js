firebase.initializeApp({
    apiKey: "AIzaSyCJAwDYwDnW_uX8KOSQuz7SIAGJscBc_QU",
    authDomain: "secondbyte33.firebaseapp.com",
    projectId: "secondbyte33",
    storageBucket: "secondbyte33.appspot.com",
    messagingSenderId: "707492674406",
    appId: "1:707492674406:web:e9255b69b12808bf3ae6a7"
});

const auth    = firebase.auth();
const db      = firebase.firestore();
const storage = firebase.storage();

// Única declaración global de colecciones
const items       = db.collection("items");
const users       = db.collection("usuaris");
const components  = db.collection("components");
const guias       = db.collection("guias");