function getFirebaseErrorMessage(error) {
  if (!error || !error.code) {
    return "S'ha produït un error inesperat";
  }

  switch (error.code) {
    case "auth/invalid-email":
      return "El correu electrònic no és vàlid";
    case "auth/user-disabled":
      return "Aquest compte està desactivat";
    case "auth/user-not-found":
      return "No existeix cap usuari amb aquest correu";
    case "auth/wrong-password":
      return "La contrasenya no és correcta";
    case "auth/email-already-in-use":
      return "Aquest correu ja està registrat";
    case "auth/weak-password":
      return "La contrasenya és massa feble (mínim 8 caràcters)";
    case "auth/popup-closed-by-user":
      return "La finestra de Google es va tancar abans de completar l'autenticació";
    case "auth/account-exists-with-different-credential":
      return "Ja existeix un compte amb aquest correu. Si us plau, inicia sessió amb el teu email i contrasenya.";
    default:
      return "Error: " + error.message;
  }
}

async function login(email, password) {
  try {
    await auth.signInWithEmailAndPassword(email, password);
    showAlert("Autenticació correcta", "alert-success");
  } catch (error) {
    showAlert(getFirebaseErrorMessage(error), "alert-danger");
  }
}

async function signup(email, password) {
  try {
    await auth.createUserWithEmailAndPassword(email, password);
    showAlert("Usuari creat correctament", "alert-success");
    document.getElementById("signupFormElement").reset();
    showLogin();
  } catch (error) {
    showAlert(getFirebaseErrorMessage(error), "alert-danger");
  }
}

async function loginWithGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();
  provider.setCustomParameters({
    prompt: 'select_account'
  });
  
  try {
    const result = await auth.signInWithPopup(provider);
    showAlert(`Benvingut/da ${result.user.displayName || result.user.email}`, "alert-success");
  } catch (error) {
    showAlert(getFirebaseErrorMessage(error), "alert-danger");
  }
}

async function logout() {
  try {
    await auth.signOut();
    showAlert("Sessió tancada correctament", "alert-success");
  } catch (error) {
    showAlert(getFirebaseErrorMessage(error), "alert-danger");
  }
}