/* =========================================================
   LEON SPORTS — script.js
   Fetch de productos + carrito (localStorage) + formulario
   ========================================================= */

(() => {
  "use strict";

  /* ---------- Config ---------- */
  // Endpoint REST propio con el catálogo de productos deportivos en español.
  const API_URL = "products.json";
  const CART_KEY = "leonSportsCart";
  const CATEGORY_LABELS = {
    futbol: "Fútbol",
    basquet: "Básquet",
    running: "Running",
    accesorios: "Accesorios",
  };
  // Reemplazá "TU_ID_DE_FORMSPREE" por el endpoint real de tu cuenta Formspree
  const FORMSPREE_ENDPOINT = "https://formspree.io/f/TU_ID_DE_FORMSPREE";

  /* ---------- Estado ---------- */
  let allProducts = [];
  let activeFilter = "all";
  let cart = loadCart();

  /* ---------- Referencias del DOM ---------- */
  const productsGrid = document.getElementById("productsGrid");
  const productsStatus = document.getElementById("productsStatus");
  const filterChips = document.querySelectorAll(".filter-chip");

  const cartToggle = document.getElementById("cartToggle");
  const cartPanel = document.getElementById("cartPanel");
  const cartOverlay = document.getElementById("cartOverlay");
  const cartClose = document.getElementById("cartClose");
  const cartItemsEl = document.getElementById("cartItems");
  const cartCountEl = document.getElementById("cartCount");
  const cartTotalEl = document.getElementById("cartTotal");
  const clearCartBtn = document.getElementById("clearCartBtn");
  const checkoutBtn = document.getElementById("checkoutBtn");

  const contactForm = document.getElementById("contactForm");
  const formFeedback = document.getElementById("formFeedback");

  const appToastEl = document.getElementById("appToast");
  const appToastBody = document.getElementById("appToastBody");

  /* =========================================================
     CARRITO: persistencia con localStorage
     ========================================================= */
  function loadCart() {
    try {
      const raw = localStorage.getItem(CART_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (err) {
      console.error("No se pudo leer el carrito de localStorage:", err);
      return [];
    }
  }

  function saveCart() {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch (err) {
      console.error("No se pudo guardar el carrito en localStorage:", err);
    }
  }

  function addToCart(product) {
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({
        id: product.id,
        nombre: product.nombre,
        precio: product.precio,
        categoria: product.categoria,
        qty: 1,
      });
    }
    saveCart();
    renderCart();
    showToast(`"${truncate(product.nombre, 40)}" agregado al carrito`);
  }

  function updateQty(id, delta) {
    const item = cart.find((i) => i.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
      cart = cart.filter((i) => i.id !== id);
    }
    saveCart();
    renderCart();
  }

  function removeFromCart(id) {
    cart = cart.filter((i) => i.id !== id);
    saveCart();
    renderCart();
  }

  function clearCart() {
    cart = [];
    saveCart();
    renderCart();
  }

  function cartTotal() {
    return cart.reduce((sum, item) => sum + item.precio * item.qty, 0);
  }

  function cartCount() {
    return cart.reduce((sum, item) => sum + item.qty, 0);
  }

  function renderCart() {
    cartCountEl.textContent = cartCount();

    if (cart.length === 0) {
      cartItemsEl.innerHTML = `<p class="cart-empty">Tu carrito está vacío. ¡Sumá algún producto!</p>`;
    } else {
      cartItemsEl.innerHTML = cart
        .map(
          (item) => `
        <div class="cart-item" data-id="${item.id}">
          <div class="cart-item-icon">${categoryIcon(item.categoria)}</div>
          <div>
            <p class="cart-item-title">${escapeHtml(item.nombre)}</p>
            <p class="cart-item-price">${formatPrice(item.precio * item.qty)}</p>
            <div class="qty-control">
              <button type="button" class="qty-minus" aria-label="Restar unidad de ${escapeHtml(item.nombre)}">−</button>
              <span>${item.qty}</span>
              <button type="button" class="qty-plus" aria-label="Sumar unidad de ${escapeHtml(item.nombre)}">+</button>
            </div>
          </div>
          <button type="button" class="cart-item-remove" aria-label="Quitar ${escapeHtml(item.nombre)} del carrito">
            <i class="bi bi-trash3-fill" aria-hidden="true"></i>
          </button>
        </div>
      `
        )
        .join("");
    }

    cartTotalEl.textContent = formatPrice(cartTotal());
  }

  function openCart() {
    cartPanel.classList.add("open");
    cartOverlay.classList.add("show");
    cartToggle.setAttribute("aria-expanded", "true");
    cartPanel.focus();
  }

  function closeCart() {
    cartPanel.classList.remove("open");
    cartOverlay.classList.remove("show");
    cartToggle.setAttribute("aria-expanded", "false");
    cartToggle.focus();
  }

  cartToggle.addEventListener("click", () => {
    const isOpen = cartPanel.classList.contains("open");
    isOpen ? closeCart() : openCart();
  });
  cartClose.addEventListener("click", closeCart);
  cartOverlay.addEventListener("click", closeCart);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && cartPanel.classList.contains("open")) {
      closeCart();
    }
  });

  cartItemsEl.addEventListener("click", (e) => {
    const row = e.target.closest(".cart-item");
    if (!row) return;
    const id = Number(row.dataset.id);

    if (e.target.closest(".qty-plus")) updateQty(id, 1);
    if (e.target.closest(".qty-minus")) updateQty(id, -1);
    if (e.target.closest(".cart-item-remove")) removeFromCart(id);
  });

  clearCartBtn.addEventListener("click", () => {
    if (cart.length === 0) return;
    clearCart();
    showToast("Carrito vaciado");
  });

  checkoutBtn.addEventListener("click", () => {
    if (cart.length === 0) {
      showToast("Tu carrito está vacío");
      return;
    }
    showToast("¡Compra simulada con éxito! Gracias por elegir Leon Sports.");
    clearCart();
    closeCart();
  });

  /* =========================================================
     PRODUCTOS: fetch a la API REST + render + filtro
     ========================================================= */
  async function fetchProducts() {
    productsStatus.textContent = "Cargando productos…";
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error(`Error HTTP ${response.status}`);
      const data = await response.json();
      allProducts = data;
      productsStatus.textContent = "";
      renderProducts();
    } catch (err) {
      console.error("Error al obtener productos:", err);
      productsStatus.textContent =
        "No pudimos cargar el catálogo en este momento. Intentá recargar la página.";
    }
  }

  function renderProducts() {
    const filtered =
      activeFilter === "all"
        ? allProducts
        : allProducts.filter((p) => p.categoria === activeFilter);

    if (filtered.length === 0) {
      productsGrid.innerHTML = `<p class="cart-empty">No hay productos en esta categoría por ahora.</p>`;
      return;
    }

    productsGrid.innerHTML = filtered
      .map(
        (product, index) => `
      <article class="product-card">
        <div class="product-media">
          <span class="product-number">${String(index + 1).padStart(2, "0")}</span>
          ${categoryIcon(product.categoria)}
        </div>
        <div class="product-body">
          <span class="product-category">${CATEGORY_LABELS[product.categoria] || "Deportes"}</span>
          <h3 class="product-title">${escapeHtml(product.nombre)}</h3>
          <p class="product-price">${formatPrice(product.precio)}</p>
          <button type="button" class="btn-add-cart" data-id="${product.id}">
            <i class="bi bi-bag-plus-fill" aria-hidden="true"></i> Agregar al carrito
          </button>
        </div>
      </article>
    `
      )
      .join("");
  }

  productsGrid.addEventListener("click", (e) => {
    const btn = e.target.closest(".btn-add-cart");
    if (!btn) return;
    const id = Number(btn.dataset.id);
    const product = allProducts.find((p) => p.id === id);
    if (product) addToCart(product);
  });

  filterChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      filterChips.forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      activeFilter = chip.dataset.filter;
      renderProducts();
    });
  });

  /* =========================================================
     FORMULARIO DE CONTACTO: validación + envío a Formspree
     ========================================================= */
  function validateField(id, condition, message) {
    const field = document.getElementById(id);
    const errorEl = document.getElementById(`error-${id}`);
    const group = field.closest(".form-group");

    if (!condition) {
      errorEl.textContent = message;
      group.classList.add("has-error");
      return false;
    }
    errorEl.textContent = "";
    group.classList.remove("has-error");
    return true;
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const email = document.getElementById("email").value.trim();
    const mensaje = document.getElementById("mensaje").value.trim();

    const nombreOk = validateField("nombre", nombre.length >= 2, "Ingresá tu nombre completo.");
    const emailOk = validateField("email", isValidEmail(email), "Ingresá un correo electrónico válido.");
    const mensajeOk = validateField("mensaje", mensaje.length >= 10, "Contanos un poco más (mínimo 10 caracteres).");

    if (!nombreOk || !emailOk || !mensajeOk) {
      formFeedback.textContent = "Revisá los campos marcados en rojo.";
      formFeedback.className = "form-feedback error";
      return;
    }

    formFeedback.textContent = "Enviando…";
    formFeedback.className = "form-feedback";

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(contactForm),
      });

      if (response.ok) {
        formFeedback.textContent = "¡Gracias! Recibimos tu mensaje y te responderemos pronto.";
        formFeedback.className = "form-feedback success";
        contactForm.reset();
      } else {
        throw new Error("Formspree respondió con un error");
      }
    } catch (err) {
      console.error("Error al enviar el formulario:", err);
      formFeedback.textContent =
        "No pudimos enviar tu mensaje. Verificá el endpoint de Formspree o intentá nuevamente.";
      formFeedback.className = "form-feedback error";
    }
  });

  /* =========================================================
     TOAST de feedback
     ========================================================= */
  let bsToast;
  function showToast(message) {
    appToastBody.textContent = message;
    if (window.bootstrap) {
      bsToast = bsToast || new bootstrap.Toast(appToastEl, { delay: 2500 });
      bsToast.show();
    }
  }

  /* =========================================================
     Utilidades
     ========================================================= */
  function truncate(str, max) {
    return str.length > max ? `${str.slice(0, max)}…` : str;
  }

  function formatPrice(value) {
    return `$${value.toLocaleString("es-AR")}`;
  }

  // Ilustraciones SVG propias por categoría deportiva (sin depender de imágenes externas)
  function categoryIcon(categoria) {
    const icons = {
      futbol: `<svg viewBox="0 0 100 100" class="product-icon" role="img" aria-label="Ícono de fútbol">
        <circle cx="50" cy="50" r="34" fill="none" stroke="var(--leon-blue)" stroke-width="4"/>
        <polygon points="50,32 61,41 57,54 43,54 39,41" fill="var(--leon-blue)"/>
        <line x1="50" y1="32" x2="50" y2="18" stroke="var(--leon-blue)" stroke-width="3"/>
        <line x1="61" y1="41" x2="74" y2="36" stroke="var(--leon-blue)" stroke-width="3"/>
        <line x1="57" y1="54" x2="65" y2="66" stroke="var(--leon-blue)" stroke-width="3"/>
        <line x1="43" y1="54" x2="35" y2="66" stroke="var(--leon-blue)" stroke-width="3"/>
        <line x1="39" y1="41" x2="26" y2="36" stroke="var(--leon-blue)" stroke-width="3"/>
      </svg>`,
      basquet: `<svg viewBox="0 0 100 100" class="product-icon" role="img" aria-label="Ícono de básquet">
        <circle cx="50" cy="50" r="34" fill="none" stroke="var(--leon-blue)" stroke-width="4"/>
        <line x1="50" y1="16" x2="50" y2="84" stroke="var(--leon-blue)" stroke-width="3"/>
        <line x1="16" y1="50" x2="84" y2="50" stroke="var(--leon-blue)" stroke-width="3"/>
        <path d="M20,26 Q50,50 20,74" fill="none" stroke="var(--leon-blue)" stroke-width="3"/>
        <path d="M80,26 Q50,50 80,74" fill="none" stroke="var(--leon-blue)" stroke-width="3"/>
      </svg>`,
      running: `<svg viewBox="0 0 100 100" class="product-icon" role="img" aria-label="Ícono de running">
        <path d="M20,66 h18 l8,-10 14,4 -3,10 h26 a6,6 0 0 1 0,10 H24 a8,8 0 0 1 -8,-8 Z" fill="var(--leon-blue)"/>
        <circle cx="40" cy="30" r="7" fill="var(--leon-blue)"/>
        <path d="M40,40 l-6,16 -12,8 M40,40 l10,10 14,-4 M50,50 l4,16" fill="none" stroke="var(--leon-blue)" stroke-width="4" stroke-linecap="round"/>
      </svg>`,
      accesorios: `<svg viewBox="0 0 100 100" class="product-icon" role="img" aria-label="Ícono de accesorios deportivos">
        <rect x="24" y="38" width="52" height="40" rx="6" fill="none" stroke="var(--leon-blue)" stroke-width="4"/>
        <path d="M38,38 v-8 a12,12 0 0 1 24,0 v8" fill="none" stroke="var(--leon-blue)" stroke-width="4"/>
        <line x1="24" y1="54" x2="76" y2="54" stroke="var(--leon-blue)" stroke-width="3"/>
      </svg>`,
    };
    return icons[categoria] || icons.accesorios;
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  /* =========================================================
     Init
     ========================================================= */
  renderCart();
  fetchProducts();
})();
