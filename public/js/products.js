const sampleProducts = [
  { name: "Intel Core i7-12700K", category: "processador", condition: "excellent", price: 299, originalPrice: 429, description: "Processador Intel Core i7-12700K en excel·lent estat.", image: null, seller: "SecondByte Certified", createdAt: new Date().toISOString() },
  { name: "ASUS ROG Strix B760-F", category: "placa_base", condition: "excellent", price: 189, originalPrice: 279, description: "Placa base gaming amb WiFi i DDR5.", image: null, seller: "SecondByte Certified", createdAt: new Date().toISOString() },
  { name: "NVIDIA RTX 3060 Ti", category: "targeta_grafica", condition: "good", price: 279, originalPrice: 499, description: "GPU perfecta per gaming i treball creatiu.", image: null, seller: "SecondByte Certified", createdAt: new Date().toISOString() },
  { name: "Corsair Vengeance DDR5 32GB", category: "ram", condition: "excellent", price: 109, originalPrice: 159, description: "Kit DDR5 amb molt poc ús.", image: null, seller: "SecondByte Certified", createdAt: new Date().toISOString() }
];

async function initSampleProducts() {
  const existingProducts = await selectAll(products);
  if (existingProducts.length === 0) {
    for (const product of sampleProducts) {
      await add(products, product);
    }
  }
}

async function loadProducts() {
  try {
    const allProducts = await selectAll(products);
    displayProducts(allProducts);
  } catch (error) {
    console.error(error);
    showAlert("Error carregant els productes", "alert-danger");
  }
}

function displayProducts(productsArray) {
  const grid = document.getElementById("productsGrid");
  if (!grid) return;
  const category = document.getElementById("categoryFilter")?.value || "all";
  const condition = document.getElementById("conditionFilter")?.value || "all";
  const sort = document.getElementById("sortFilter")?.value || "price_asc";

  let filtered = [...productsArray];
  if (category !== "all") filtered = filtered.filter((p) => (p.data().category || "") === category);
  if (condition !== "all") filtered = filtered.filter((p) => (p.data().condition || "") === condition);

  filtered.sort((a, b) => {
    const ad = a.data();
    const bd = b.data();
    if (sort === "price_asc") return (ad.price || 0) - (bd.price || 0);
    if (sort === "price_desc") return (bd.price || 0) - (ad.price || 0);
    if (sort === "newest") return new Date(bd.createdAt || 0) - new Date(ad.createdAt || 0);
    return String(ad.name || "").localeCompare(String(bd.name || ""));
  });

  if (filtered.length === 0) {
    grid.innerHTML = `<div class="empty-market"><i class="fas fa-box-open"></i><p>No s'han trobat productes amb aquests filtres</p></div>`;
    return;
  }

  const categoryText = {
    processador: "Processador", placa_base: "Placa base", targeta_grafica: "Targeta gràfica", ram: "RAM", emmagatzematge: "Emmagatzematge",
    smartphones: "Smartphone", portatils: "Portàtil", components: "Component", tablets: "Tablet"
  };
  const conditionText = { excellent: "Excel·lent", good: "Bo", fair: "Acceptable" };

  grid.innerHTML = filtered.map((doc) => {
    const p = doc.data();
    const hasImage = p.image && p.image !== "";
    return `
      <article class="product-card">
        <div class="product-image-wrap">
          ${hasImage ? `<img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.name)}" class="product-image" />` : `<div class="product-image-placeholder"><i class="fas fa-microchip"></i></div>`}
          <span class="product-badge ${p.condition || 'good'}">${conditionText[p.condition] || p.condition || 'Bo'}</span>
        </div>
        <div class="product-body">
          <h3>${escapeHtml(p.name)}</h3>
          <div class="product-meta"><span>${categoryText[p.category] || p.category || 'Producte'}</span><span>${escapeHtml(p.seller || 'Usuari')}</span></div>
          <p>${escapeHtml((p.description || '').substring(0, 120))}${(p.description || '').length > 120 ? '...' : ''}</p>
          <div class="product-price-row"><strong>${Number(p.price || 0)}€</strong>${p.originalPrice ? `<s>${Number(p.originalPrice)}€</s>` : ''}</div>
          <button class="btn btn-primary btn-block" onclick="addToCart('${doc.id}')">Comprar</button>
        </div>
      </article>`;
  }).join("");
}

function addToCart() {
  showAlert("Producte afegit al carretó. El checkout complet encara no està muntat.", "alert-success");
}

async function uploadImage(file) {
  if (!file) return null;
  const fileName = `products/${Date.now()}_${file.name}`;
  const storageRef = storage.ref(fileName);
  const snapshot = await storageRef.put(file);
  return snapshot.ref.getDownloadURL();
}

async function publishProduct(productData) {
  const newProduct = {
    ...productData,
    seller: auth.currentUser?.email || "Usuari anònim",
    sellerId: auth.currentUser?.uid || null,
    createdAt: new Date().toISOString(),
    status: "published"
  };
  await add(products, newProduct);
  showAlert("Producte publicat correctament", "alert-success");
  document.getElementById("sellFormElement")?.reset();
  document.getElementById("productImageUrl").value = "";
  document.getElementById("productImageManual").value = "";
  document.getElementById("imagePreview").innerHTML = "";
  await loadProducts();
}

function setupFilters() {
  document.getElementById("applyFilters")?.addEventListener("click", loadProducts);
}

function setupImageUpload() {
  const uploadBtn = document.getElementById("uploadImageBtn");
  const fileInput = document.getElementById("productImageFile");
  const imagePreview = document.getElementById("imagePreview");
  const imageUrlInput = document.getElementById("productImageUrl");
  const imageManualInput = document.getElementById("productImageManual");

  uploadBtn?.addEventListener("click", () => fileInput?.click());
  fileInput?.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      showAlert("Selecciona una imatge vàlida", "alert-danger");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showAlert("La imatge no pot superar els 5MB", "alert-danger");
      return;
    }
    try {
      showAlert("Pujant imatge...", "alert-success");
      const url = await uploadImage(file);
      imageUrlInput.value = url;
      imageManualInput.value = "";
      imagePreview.innerHTML = `<img src="${url}" alt="Preview" />`;
      showAlert("Imatge pujada correctament", "alert-success");
    } catch (error) {
      console.error(error);
      showAlert("Error al pujar la imatge", "alert-danger");
    }
  });

  imageManualInput?.addEventListener("input", () => {
    const url = imageManualInput.value.trim();
    imageUrlInput.value = url;
    imagePreview.innerHTML = url ? `<img src="${url}" alt="Preview" />` : "";
  });
}
