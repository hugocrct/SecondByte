// Referència a la col·lecció "products" de Firestore
const products = db.collection("products");

// Productes de mostra inicials (components)
const sampleProducts = [
  {
    name: "Intel Core i7-12700K",
    category: "processador",
    condition: "excellent",
    price: 299,
    originalPrice: 429,
    description: "Processador Intel Core i7-12700K, 12 nuclis (8P+4E), 20 fils, 25MB cache. Perfecte estat, només 3 mesos d'ús. Inclou caixa original.",
    image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=300",
    seller: "SecondByte Certified",
    createdAt: new Date().toISOString()
  },
  {
    name: "ASUS ROG Strix B760-F",
    category: "placa_base",
    condition: "excellent",
    price: 189,
    originalPrice: 279,
    description: "Placa base ASUS ROG Strix B760-F Gaming WiFi, socket LGA 1700, DDR5, PCIe 5.0. Com a nova, amb tots els accessoris.",
    image: "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=300",
    seller: "SecondByte Certified",
    createdAt: new Date().toISOString()
  },
  {
    name: "NVIDIA RTX 3060 Ti",
    category: "targeta_grafica",
    condition: "good",
    price: 279,
    originalPrice: 499,
    description: "NVIDIA RTX 3060 Ti, 8GB GDDR6. Lleugeres marques d'ús, funciona perfectament. Inclou caixa original.",
    image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=300",
    seller: "SecondByte Certified",
    createdAt: new Date().toISOString()
  },
  {
    name: "Corsair Vengeance DDR5 32GB",
    category: "ram",
    condition: "excellent",
    price: 109,
    originalPrice: 159,
    description: "Kit de 2x16GB Corsair Vengeance DDR5 5600MHz CL36. Com a nou, amb embalatge original.",
    image: "https://images.unsplash.com/photo-1562976540-1502c2145186?w=300",
    seller: "SecondByte Certified",
    createdAt: new Date().toISOString()
  },
  {
    name: "Samsung 980 Pro 1TB NVMe",
    category: "emmagatzematge",
    condition: "good",
    price: 89,
    originalPrice: 149,
    description: "SSD Samsung 980 Pro 1TB PCIe 4.0 NVMe. Lleuger ús, 98% de vida útil restant.",
    image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=300",
    seller: "SecondByte Certified",
    createdAt: new Date().toISOString()
  }
];

// Inicialitzar productes de mostra si no n'hi ha
async function initSampleProducts() {
  const existingProducts = await selectAll(products);
  if (existingProducts.length === 0) {
    for (const product of sampleProducts) {
      await add(products, product);
    }
    console.log("Productes de mostra afegits");
  }
}

// Carregar i mostrar productes
async function loadProducts() {
  try {
    const allProducts = await selectAll(products);
    displayProducts(allProducts);
  } catch (error) {
    console.error("Error carregant productes:", error);
    showAlert("Error carregant els components", "alert-danger");
  }
}

// Mostrar productes amb filtres
function displayProducts(productsArray) {
  const grid = document.getElementById("productsGrid");
  if (!grid) return;

  const category = document.getElementById("categoryFilter")?.value || "all";
  const condition = document.getElementById("conditionFilter")?.value || "all";
  const sort = document.getElementById("sortFilter")?.value || "price_asc";

  let filtered = [...productsArray];

  if (category !== "all") {
    filtered = filtered.filter(p => p.data().category === category);
  }

  if (condition !== "all") {
    filtered = filtered.filter(p => p.data().condition === condition);
  }

  filtered.sort((a, b) => {
    const aData = a.data();
    const bData = b.data();
    
    if (sort === "price_asc") return aData.price - bData.price;
    if (sort === "price_desc") return bData.price - aData.price;
    if (sort === "newest") return new Date(bData.createdAt) - new Date(aData.createdAt);
    if (sort === "name_asc") return aData.name.localeCompare(bData.name);
    if (sort === "name_desc") return bData.name.localeCompare(aData.name);
    return 0;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="col-12 text-center py-5">
        <i class="fas fa-microchip fa-3x mb-3" style="color: var(--text-muted);"></i>
        <p class="text-muted">No s'han trobat components amb aquests filtres</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(doc => {
    const product = doc.data();
    const conditionText = {
      excellent: "Excel·lent",
      good: "Bo",
      fair: "Acceptable"
    }[product.condition];
    
    const categoryText = {
      processador: "Processador",
      placa_base: "Placa base",
      targeta_grafica: "Targeta gràfica",
      ram: "Memòria RAM",
      emmagatzematge: "Emmagatzematge",
      font_alimentacio: "Font alimentació",
      refrigeracio: "Refrigeració"
    }[product.category] || product.category;

    const hasImage = product.image && product.image !== "null" && product.image !== "";
    const imageHtml = hasImage 
      ? `<img src="${product.image}" alt="${escapeHtml(product.name)}" class="product-image" onerror="this.src='https://via.placeholder.com/300x200?text=Component'" />`
      : `<div class="product-image-placeholder"><i class="fas fa-microchip fa-3x" style="color: var(--pink);"></i></div>`;

    return `
      <div class="product-card">
        <div style="position: relative;">
          ${imageHtml}
          <span class="product-badge ${product.condition}">
            ${conditionText}
          </span>
        </div>
        <div class="card-inner" style="flex: 1; display: flex; flex-direction: column;">
          <h3 class="card-title" style="font-size: 1.1rem;">${escapeHtml(product.name)}</h3>
          <div class="product-stats">
            <span class="product-condition">
              <i class="fas fa-tag"></i> ${categoryText}
            </span>
            <span class="product-condition">
              <i class="fas fa-shield-alt"></i> 12 mesos garantia
            </span>
          </div>
          <p class="card-text" style="font-size: 0.85rem; margin: 12px 0;">${escapeHtml(product.description.substring(0, 80))}${product.description.length > 80 ? "..." : ""}</p>
          <div class="d-flex align-items-baseline" style="margin-top: auto;">
            <span class="product-price">${product.price}€</span>
            ${product.originalPrice ? `<span class="product-original-price">${product.originalPrice}€</span>` : ""}
          </div>
          <button class="btn btn-marketplace" onclick="addToCart('${doc.id}')">
            <i class="fas fa-shopping-cart"></i> Comprar
          </button>
        </div>
      </div>
    `;
  }).join("");
}

function addToCart(productId) {
  showAlert("Component afegit al carretó! Properament podràs finalitzar la compra.", "alert-success");
}

// Publicar un nou producte per vendre
async function publishProduct(productData) {
  try {
    const newProduct = {
      ...productData,
      seller: auth.currentUser?.email || "Usuari anònim",
      sellerId: auth.currentUser?.uid || null,
      createdAt: new Date().toISOString(),
      status: "pending"
    };
    
    await add(products, newProduct);
    showAlert("Component enviat per revisió! Rebràs una resposta en 24h", "alert-success");
    document.getElementById("sellFormElement").reset();
    
    await loadProducts();
  } catch (error) {
    console.error("Error publicant component:", error);
    showAlert("Error al publicar el component", "alert-danger");
  }
}

function setupFilters() {
  const applyBtn = document.getElementById("applyFilters");
  if (applyBtn) {
    applyBtn.addEventListener("click", async () => {
      const allProducts = await selectAll(products);
      displayProducts(allProducts);
    });
  }
}

// Setup per la pujada d'imatges (ara amb URL)
function setupImageUpload() {
  // Aquesta funció es manté per compatibilitat però ara fem servir URL directament
  // No cal pujar imatges a Storage, només s'usa l'URL que l'usuari proporciona
  console.log("Image upload setup completed - using URL only");
}