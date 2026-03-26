// Inicialització de Firebase
firebase.initializeApp({
    apiKey: "AIzaSyCJAwDYwDnW_uX8KOSQuz7SIAGJscBc_QU",
    authDomain: "secondbyte33.firebaseapp.com",
    projectId: "secondbyte33",
    storageBucket: "secondbyte33.firebasestorage.app",
    messagingSenderId: "707492674406",
    appId: "1:707492674406:web:e9255b69b12808bf3ae6a7"
});

// Instàncies globals
const auth = firebase.auth();
const db   = firebase.firestore();