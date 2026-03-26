function showAlert(text, type) {
  const alertEl = document.getElementById("alert");
  alertEl.innerText = text;
  alertEl.className = `alert ${type}`;
  alertEl.style.display = "block";

  setTimeout(() => {
    alertEl.style.display = "none";
  }, 3000);
}

function showLogin() {
  document.getElementById("loginForm").classList.remove("d-none");
  document.getElementById("signupForm").classList.add("d-none");
  document.getElementById("itemsPanel").classList.add("d-none");
  document.getElementById("topBar").classList.add("d-none");
}

function showSignup() {
  document.getElementById("loginForm").classList.add("d-none");
  document.getElementById("signupForm").classList.remove("d-none");
  document.getElementById("itemsPanel").classList.add("d-none");
  document.getElementById("topBar").classList.add("d-none");
}

function showItems(user) {
  document.getElementById("loginForm").classList.add("d-none");
  document.getElementById("signupForm").classList.add("d-none");
  document.getElementById("itemsPanel").classList.remove("d-none");
  document.getElementById("topBar").classList.remove("d-none");
  document.getElementById("listItems").classList.remove("d-none");
  document.getElementById("authStatus").innerText = `Sessió iniciada com a ${user.email}`;
}

async function refreshItemsView() {
  await loadItems();

  const table = document.getElementById("listItems");
  const emptyState = document.getElementById("emptyState");
  const tbody = table.querySelector("tbody");
  
  if (!tbody || tbody.children.length === 0) {
    emptyState.classList.remove("d-none");
    table.classList.add("d-none");
  } else {
    emptyState.classList.add("d-none");
    table.classList.remove("d-none");
  }
}