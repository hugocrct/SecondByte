document.addEventListener("DOMContentLoaded", () => {
  setupUiEnhancements();

  // 1. Listeners de navegación
  document.getElementById("newUser")?.addEventListener("click", showSignup);
  document.getElementById("backToLogin")?.addEventListener("click", showLogin);
  document.getElementById("logout")?.addEventListener("click", logout);
  document.getElementById("googleLogin")?.addEventListener("click", loginWithGoogle);
  document.getElementById("googleSignup")?.addEventListener("click", loginWithGoogle);

  // 2. Formulario de Login
  document.getElementById("loginFormElement")?.addEventListener("submit", (e) => {
    e.preventDefault();
    login(document.getElementById("loginEmail").value, document.getElementById("loginPassword").value);
  });

  // 3. Formulario de Registro
  document.getElementById("signupFormElement")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = {
      nom: document.getElementById("signupNom").value,
      cognom: document.getElementById("signupCognom").value,
      provincia: document.getElementById("signupProvincia").value
    };
    signup(document.getElementById("signupEmail").value, document.getElementById("signupPassword").value, data);
  });

  // 4. Formulario de Componentes (EL QUE TE FALLABA)
  document.getElementById("compFormElement")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = {
      nom: document.getElementById("compNom").value,
      categoria: document.getElementById("compCategoria").value,
      estat: document.getElementById("compEstat").value,
      preu: document.getElementById("compPreu").value,
      compatibilitat: document.getElementById("compCompatibilitat").value
    };
    await addComponent(data);
    e.target.reset();
  });

  // 5. Observador de Sesión
  auth.onAuthStateChanged(async (user) => {
    if (user) {
      showItems(user);
      loadItems();
      loadComponents();
      loadUsers();
    } else {
      showLogin();
    }
  });

  loadMarketplaceData();
});

async function loadMarketplaceData() {
  try {
    await initSampleProducts();
    await loadProducts();
    setupFilters();
  } catch (e) { console.error("Error inicial:", e); }
}