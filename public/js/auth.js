async function signup(email, password, extraData) {
    try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        await addUser(userCredential, extraData);
        showAlert("Compte creat correctament!", "alert-success");
    } catch (error) {
        showAlert("Error en el registre: " + error.message, "alert-danger");
    }
}

async function login(email, password) {
    try {
        await auth.signInWithEmailAndPassword(email, password);
        showAlert("Benvingut de nou!", "alert-success");
    } catch (error) {
        showAlert("Error de login: " + error.message, "alert-danger");
    }
}

async function loginWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
        const result = await auth.signInWithPopup(provider);
        await addUser(result.user, { 
            nom: result.user.displayName || "Usuari Google", 
            cognom: "", telefon: "", provincia: "" 
        });
    } catch (error) {
        showAlert("Error con Google: " + error.message, "alert-danger");
    }
}

async function logout() {
    try {
        await auth.signOut();
        showLogin();
        showAlert("Sessió tancada", "alert-success");
    } catch (error) {
        console.error(error);
    }
}