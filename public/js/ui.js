function showAlert(text, type) {
  const alertEl = document.getElementById("alert");
  if (!alertEl) return;
  alertEl.innerText = text;
  alertEl.className = `alert ${type}`;
  alertEl.style.display = "block";
  setTimeout(() => { alertEl.style.display = "none"; }, 3000);
}

function showLogin() {
  document.getElementById("loginForm")?.classList.remove("d-none");
  document.getElementById("signupForm")?.classList.add("d-none");
  document.getElementById("itemsPanel")?.classList.add("d-none");
  document.getElementById("topBar")?.classList.add("d-none");
}

function showSignup() {
  document.getElementById("loginForm")?.classList.add("d-none");
  document.getElementById("signupForm")?.classList.remove("d-none");
}

function showItems(user) {
  document.getElementById("loginForm")?.classList.add("d-none");
  document.getElementById("signupForm")?.classList.add("d-none");
  document.getElementById("itemsPanel")?.classList.remove("d-none");
  document.getElementById("topBar")?.classList.remove("d-none");
  document.getElementById("authStatus").innerText = `Sessió: ${user.email}`;
}

function setupUiEnhancements() {
  // Cookies
  document.getElementById("cookie-accept")?.addEventListener("click", () => {
      document.getElementById("cookie-banner").style.display = "none";
  });
  document.getElementById("cookie-reject")?.addEventListener("click", () => {
      document.getElementById("cookie-banner").style.display = "none";
  });

  // Menú móvil
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("nav-menu");
  hamburger?.addEventListener("click", () => {
    navMenu.classList.toggle("active");
  });
}