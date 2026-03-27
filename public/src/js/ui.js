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

// ── Hamburger menu ──────────────────────────────────────────────
function initHamburgerMenu() {
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');
  
  if (!hamburger || !navMenu) return;

  hamburger.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  // Tanca el menú en clicar un enllaç
  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  // Tanca el menú en clicar fora
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
      navMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });
}

// ── Active nav amb IntersectionObserver ─────────────────────────
function initActiveNavObserver() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  if (!sections.length || !navLinks.length) return;

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(a => a.classList.remove('active'));
        const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: '-30% 0px -60% 0px' });

  sections.forEach(s => sectionObserver.observe(s));
}

// ── Back to top ─────────────────────────────────────────────────
function initBackToTop() {
  const backTop = document.getElementById('back-to-top');
  if (!backTop) return;

  window.addEventListener('scroll', () => {
    backTop.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  backTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ── Cookie banner (RGPD) ────────────────────────────────────────
function initCookieBanner() {
  const cookieBanner = document.getElementById('cookie-banner');
  const cookieAccept = document.getElementById('cookie-accept');
  const cookieReject = document.getElementById('cookie-reject');
  
  if (!cookieBanner) return;

  if (!localStorage.getItem('cookieConsent')) {
    setTimeout(() => cookieBanner.classList.add('visible'), 1200);
  }

  if (cookieAccept) {
    cookieAccept.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'accepted');
      cookieBanner.classList.remove('visible');
      // TODO: activar Google Analytics o altres cookies de tercers quan es connecti Firebase
    });
  }

  if (cookieReject) {
    cookieReject.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'rejected');
      cookieBanner.classList.remove('visible');
    });
  }
}

// Inicialitza totes les funcionalitats UI
function initUIComponents() {
  initHamburgerMenu();
  initActiveNavObserver();
  initBackToTop();
  initCookieBanner();
}