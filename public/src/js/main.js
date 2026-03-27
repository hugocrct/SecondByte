document.addEventListener("DOMContentLoaded", async () => {
  // Inicialitzar components UI (hamburger, active nav, back to top, cookie banner)
  initUIComponents();
  
  // Inicialitzar setup de pujada d'imatges
  setupImageUpload();
  
  // Inicialitzar productes de mostra
  await initSampleProducts();
  await loadProducts();
  setupFilters();

  // Event listeners
  document.getElementById("newUser").addEventListener("click", () => {
    showSignup();
  });

  document.getElementById("backToLogin").addEventListener("click", () => {
    showLogin();
  });

  document.getElementById("clearItem").addEventListener("click", () => {
    clearItemForm();
  });

  document.getElementById("logout").addEventListener("click", async () => {
    await logout();
  });

  // Google Login
  const googleLoginBtn = document.getElementById("googleLogin");
  const googleSignupBtn = document.getElementById("googleSignup");
  
  if (googleLoginBtn) {
    googleLoginBtn.addEventListener("click", async () => {
      await loginWithGoogle();
    });
  }
  
  if (googleSignupBtn) {
    googleSignupBtn.addEventListener("click", async () => {
      await loginWithGoogle();
    });
  }

  // Formulari de venda
  document.getElementById("sellFormElement").addEventListener("submit", async (event) => {
    event.preventDefault();
    
    const productName = document.getElementById("productName").value.trim();
    const productCategory = document.getElementById("productCategory").value;
    const productCondition = document.getElementById("productCondition").value;
    const productPrice = parseFloat(document.getElementById("productPrice").value);
    const productOriginalPrice = document.getElementById("productOriginalPrice").value ? parseFloat(document.getElementById("productOriginalPrice").value) : null;
    const productDescription = document.getElementById("productDescription").value.trim();
    const productImageUrl = document.getElementById("productImage").value;

    if (!productName || !productCategory || !productCondition || !productPrice || !productDescription) {
      showAlert("Tots els camps obligatoris han d'estar plens", "alert-danger");
      return;
    }

    if (productPrice <= 0) {
      showAlert("El preu ha de ser positiu", "alert-danger");
      return;
    }
    
    if (!auth.currentUser) {
      showAlert("Has d'iniciar sessió per publicar un producte", "alert-danger");
      document.getElementById("portal").scrollIntoView({ behavior: "smooth" });
      return;
    }

    await publishProduct({
      name: productName,
      category: productCategory,
      condition: productCondition,
      price: productPrice,
      originalPrice: productOriginalPrice,
      description: productDescription,
      image: productImageUrl || null
    });
  });

  // Formulari de login
  document.getElementById("loginFormElement").addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    if (!email) {
      showAlert("El correu electrònic és obligatori", "alert-danger");
      return;
    }

    if (!password) {
      showAlert("La contrasenya és obligatòria", "alert-danger");
      return;
    }

    await login(email, password);
  });

  // Formulari de registre
  document.getElementById("signupFormElement").addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("signupEmail").value.trim();
    const password = document.getElementById("signupPassword").value;
    const passwordConfirm = document.getElementById("signupPasswordConfirm").value;

    if (!email || email.indexOf("@") < 1) {
      showAlert("El correu electrònic no és vàlid", "alert-danger");
      return;
    }

    if (!password) {
      showAlert("La contrasenya és obligatòria", "alert-danger");
      return;
    }

    if (password.length < 8) {
      showAlert("La contrasenya ha de tenir una longitud mínima de 8 caràcters", "alert-danger");
      return;
    }

    if (password !== passwordConfirm) {
      showAlert("Les contrasenyes no coincideixen", "alert-danger");
      return;
    }

    await signup(email, password);
  });

  // Formulari d'items
  document.getElementById("itemsFormElement").addEventListener("submit", async (event) => {
    event.preventDefault();

    const id = document.getElementById("elementId").value;
    const title = document.getElementById("title").value.trim();
    const content = document.getElementById("content").value.trim();

    if (!title) {
      showAlert("El títol és obligatori", "alert-danger");
      return;
    }

    if (!content) {
      showAlert("La descripció és obligatòria", "alert-danger");
      return;
    }

    const doc = { title, content };

    try {
      if (!id) {
        await addItem(doc);
        showAlert("Element creat correctament", "alert-success");
      } else {
        await updateItem(id, doc);
        showAlert("Element actualitzat correctament", "alert-success");
      }

      await refreshItemsView();
    } catch (error) {
      showAlert("No s'ha pogut guardar l'element", "alert-danger");
    }
  });

  // Observer per canvis d'estat d'autenticació
  auth.onAuthStateChanged(async (user) => {
    if (user) {
      showItems(user);
      await refreshItemsView();
    } else {
      clearItemForm();
      showLogin();
    }
  });
});