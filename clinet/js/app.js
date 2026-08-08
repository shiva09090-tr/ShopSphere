const API_URL = "https://shopsphere-sedh.onrender.com/api/products";

const productsDiv = document.getElementById("products");
const search = document.getElementById("search");
const searchSecondary = document.getElementById("searchSecondary");
const categoryFilter = document.getElementById("categoryFilter");
const minPrice = document.getElementById("minPrice");
const maxPrice = document.getElementById("maxPrice");
const sortBy = document.getElementById("sortBy");
const cartCount = document.getElementById("cartCount");
const categoriesDiv = document.getElementById("categories");
const heroSlider = document.getElementById("heroSlider");
const resultCount = document.getElementById("resultCount");
const clearFilters = document.getElementById("clearFilters");

let allProducts = [];
let heroProducts = [];
let heroIndex = 0;
let heroTimer = null;

function escapeHtml(value = "") {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function getImage(product) {
    return product.image || "https://via.placeholder.com/700x450?text=ShopSphere";
}

async function loadProducts() {
    try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("Unable to load products");

        const result = await res.json();
        allProducts = Array.isArray(result.data) ? result.data : [];

        loadCategories();
        renderCategories();
        renderHero();
        filterProducts();
    } catch (error) {
        console.error("Product loading error:", error);
        if (productsDiv) {
            productsDiv.innerHTML = `<div class="empty-state"><i class="fa-solid fa-wifi"></i><h3>Products unavailable</h3><p>Please try again in a moment.</p></div>`;
        }
        if (heroSlider) {
            heroSlider.innerHTML = `<div class="hero-loading">Featured products could not be loaded.</div>`;
        }
    }
}

function uniqueCategories() {
    return [...new Set(
        allProducts
            .map(product => String(product.category || "").trim())
            .filter(Boolean)
    )].sort((a, b) => a.localeCompare(b));
}

function loadCategories() {
    if (!categoryFilter) return;
    const current = categoryFilter.value;
    categoryFilter.innerHTML = `<option value="">All Categories</option>`;

    uniqueCategories().forEach(category => {
        categoryFilter.insertAdjacentHTML(
            "beforeend",
            `<option value="${escapeHtml(category)}">${escapeHtml(category)}</option>`
        );
    });

    if (uniqueCategories().includes(current)) categoryFilter.value = current;
}

function getCategoryIcon(category) {
    const value = category.toLowerCase();
    if (value.includes("mobile") || value.includes("phone")) return "fa-mobile-screen-button";
    if (value.includes("laptop") || value.includes("computer")) return "fa-laptop";
    if (value.includes("shoe")) return "fa-shoe-prints";
    if (value.includes("fashion") || value.includes("cloth")) return "fa-shirt";
    if (value.includes("watch")) return "fa-clock";
    if (value.includes("access")) return "fa-headphones";
    if (value.includes("electronic")) return "fa-microchip";
    return "fa-tag";
}

function renderCategories() {
    if (!categoriesDiv) return;

    const categories = uniqueCategories();
    categoriesDiv.innerHTML = `
        <button class="category-card all-category active" type="button" data-category="">
            <span class="category-icon"><i class="fa-solid fa-layer-group"></i></span>
            <strong>All Products</strong>
            <small>${allProducts.length} items</small>
        </button>
        ${categories.map(category => `
            <button class="category-card" type="button" data-category="${escapeHtml(category)}">
                <span class="category-icon"><i class="fa-solid ${getCategoryIcon(category)}"></i></span>
                <strong>${escapeHtml(category)}</strong>
                <small>${allProducts.filter(p => String(p.category || "").trim() === category).length} items</small>
            </button>
        `).join("")}
    `;

    categoriesDiv.querySelectorAll(".category-card").forEach(card => {
        card.addEventListener("click", () => {
            const category = card.dataset.category || "";
            if (categoryFilter) categoryFilter.value = category;
            categoriesDiv.querySelectorAll(".category-card").forEach(item => item.classList.remove("active"));
            card.classList.add("active");
            filterProducts();
            document.getElementById("productsSection")?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    });
}

function renderHero() {
    if (!heroSlider) return;

    // Admin-selected products are used first. If none are selected, latest 3 products are shown.
    const selected = allProducts.filter(product => product.featured === true || product.featured === "true");
    heroProducts = (selected.length ? selected : [...allProducts]
        .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
        .slice(0, 3));

    if (!heroProducts.length) {
        heroSlider.innerHTML = `<div class="hero-loading">Add products from the Admin Panel to show them here.</div>`;
        return;
    }

    heroIndex = 0;
    heroSlider.innerHTML = heroProducts.map((product, index) => `
        <article class="hero-slide ${index === 0 ? "active" : ""}">
            <img src="${escapeHtml(getImage(product))}" alt="${escapeHtml(product.name)}" onerror="this.src='https://via.placeholder.com/1200x500?text=ShopSphere'">
            <div class="hero-overlay"></div>
            <div class="hero-content">
                <span class="hero-badge"><i class="fa-solid fa-bolt"></i> ${selected.length ? "Featured Product" : "Latest Product"}</span>
                <h1>${escapeHtml(product.name)}</h1>
                <p>${escapeHtml(product.description || "Discover this product at ShopSphere.")}</p>
                <div class="hero-price">₹${Number(product.price || 0).toLocaleString("en-IN")}</div>
                <div class="hero-actions">
                    <button type="button" onclick="viewProduct('${product._id}')">View Product <i class="fa-solid fa-arrow-right"></i></button>
                    <button type="button" class="hero-secondary" onclick="addToCart('${product._id}')">Add To Cart</button>
                </div>
            </div>
        </article>
    `).join("") + `
        ${heroProducts.length > 1 ? `
            <button class="hero-nav prev" id="heroPrev" type="button" aria-label="Previous product"><i class="fa-solid fa-chevron-left"></i></button>
            <button class="hero-nav next" id="heroNext" type="button" aria-label="Next product"><i class="fa-solid fa-chevron-right"></i></button>
            <div class="hero-dots">
                ${heroProducts.map((_, index) => `<button class="hero-dot ${index === 0 ? "active" : ""}" data-index="${index}" type="button" aria-label="Slide ${index + 1}"></button>`).join("")}
            </div>
        ` : ""}
    `;

    heroSlider.querySelector("#heroPrev")?.addEventListener("click", () => changeHero(-1));
    heroSlider.querySelector("#heroNext")?.addEventListener("click", () => changeHero(1));
    heroSlider.querySelectorAll(".hero-dot").forEach(dot => {
        dot.addEventListener("click", () => showHero(Number(dot.dataset.index)));
    });

    startHeroAutoPlay();
}

function showHero(index) {
    const slides = heroSlider?.querySelectorAll(".hero-slide");
    const dots = heroSlider?.querySelectorAll(".hero-dot");
    if (!slides?.length) return;

    heroIndex = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle("active", i === heroIndex));
    dots?.forEach((dot, i) => dot.classList.toggle("active", i === heroIndex));
}

function changeHero(direction) {
    showHero(heroIndex + direction);
    startHeroAutoPlay();
}

function startHeroAutoPlay() {
    clearInterval(heroTimer);
    if (heroProducts.length <= 1) return;
    heroTimer = setInterval(() => showHero(heroIndex + 1), 5000);
}

function getSearchValue() {
    const first = search?.value.trim() || "";
    const second = searchSecondary?.value.trim() || "";
    return second || first;
}

function filterProducts() {
    let products = [...allProducts];
    const query = getSearchValue().toLowerCase();

    if (query) {
        products = products.filter(product =>
            [product.name, product.brand, product.category, product.description]
                .some(value => String(value || "").toLowerCase().includes(query))
        );
    }

    if (categoryFilter?.value) {
        products = products.filter(product => String(product.category || "") === categoryFilter.value);
    }

    if (minPrice?.value !== "") {
        products = products.filter(product => Number(product.price) >= Number(minPrice.value));
    }

    if (maxPrice?.value !== "") {
        products = products.filter(product => Number(product.price) <= Number(maxPrice.value));
    }

    if (sortBy?.value === "low") products.sort((a, b) => Number(a.price) - Number(b.price));
    if (sortBy?.value === "high") products.sort((a, b) => Number(b.price) - Number(a.price));
    if (sortBy?.value === "new") products.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

    displayProducts(products);
}

function displayProducts(products) {
    if (!productsDiv) return;
    if (resultCount) resultCount.textContent = `${products.length} product${products.length === 1 ? "" : "s"} found`;

    if (!products.length) {
        productsDiv.innerHTML = `
            <div class="empty-state">
                <i class="fa-solid fa-box-open"></i>
                <h3>No products found</h3>
                <p>Try another search or clear the filters.</p>
                <button type="button" onclick="clearAllFilters()">Clear Filters</button>
            </div>
        `;
        return;
    }

    productsDiv.innerHTML = products.map(product => {
        const stock = Number(product.stock || 0);
        return `
            <article class="card">
                <div class="product-image-wrap">
                    <img src="${escapeHtml(getImage(product))}" alt="${escapeHtml(product.name)}" loading="lazy" onerror="this.src='https://via.placeholder.com/500x450?text=ShopSphere'">
                    ${stock <= 0 ? `<span class="stock-badge out">Out Of Stock</span>` : stock <= 5 ? `<span class="stock-badge">Only ${stock} left</span>` : `<span class="stock-badge in">In Stock</span>`}
                    <button class="product-heart" type="button" aria-label="Wishlist"><i class="fa-regular fa-heart"></i></button>
                </div>
                <div class="card-body">
                    <span class="product-category">${escapeHtml(product.category || "Product")}</span>
                    <h3>${escapeHtml(product.name)}</h3>
                    <p class="product-description">${escapeHtml(product.description || "Quality product from ShopSphere.")}</p>
                    <div class="rating"><span>★★★★★</span> <small>${product.rating || "New"}</small></div>
                    <div class="product-bottom">
                        <strong class="price">₹${Number(product.price || 0).toLocaleString("en-IN")}</strong>
                    </div>
                    <div class="buttons">
                        <button class="cartBtn" type="button" ${stock <= 0 ? "disabled" : ""} onclick="addToCart('${product._id}')">
                            <i class="fa-solid fa-cart-plus"></i> ${stock <= 0 ? "Unavailable" : "Add To Cart"}
                        </button>
                        <button class="detailsBtn" type="button" onclick="viewProduct('${product._id}')">Details</button>
                    </div>
                </div>
            </article>
        `;
    }).join("");
}

function addToCart(id) {
    const product = allProducts.find(item => item._id === id);
    if (!product) return;

    if (Number(product.stock) <= 0) {
        Swal.fire({ icon: "error", title: "Out Of Stock", text: "This product is currently unavailable." });
        return;
    }

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find(item => item._id === id);

    if (existing) {
        if (existing.quantity >= Number(product.stock)) {
            Swal.fire({ icon: "warning", title: "Stock Limit", text: "You cannot add more than available stock." });
            return;
        }
        existing.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    Swal.fire({ icon: "success", title: "Added To Cart", timer: 1200, showConfirmButton: false });
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const total = cart.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
    if (cartCount) cartCount.innerText = total;
}

function viewProduct(id) {
    const product = allProducts.find(item => item._id === id);
    if (!product) return;
    localStorage.setItem("selectedProduct", JSON.stringify(product));
    window.location.href = "product.html";
}

function clearAllFilters() {
    if (search) search.value = "";
    if (searchSecondary) searchSecondary.value = "";
    if (categoryFilter) categoryFilter.value = "";
    if (minPrice) minPrice.value = "";
    if (maxPrice) maxPrice.value = "";
    if (sortBy) sortBy.value = "";
    categoriesDiv?.querySelectorAll(".category-card").forEach(item => item.classList.remove("active"));
    categoriesDiv?.querySelector(".all-category")?.classList.add("active");
    filterProducts();
}
window.clearAllFilters = clearAllFilters;
window.addToCart = addToCart;
window.viewProduct = viewProduct;

[search, searchSecondary].forEach(input => input?.addEventListener("input", filterProducts));
categoryFilter?.addEventListener("change", () => {
    categoriesDiv?.querySelectorAll(".category-card").forEach(item => item.classList.toggle("active", item.dataset.category === (categoryFilter.value || "")));
    filterProducts();
});
minPrice?.addEventListener("input", filterProducts);
maxPrice?.addEventListener("input", filterProducts);
sortBy?.addEventListener("change", filterProducts);
clearFilters?.addEventListener("click", clearAllFilters);

const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const username = document.getElementById("username");

function checkLogin() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
        if (username) username.innerText = `Hi, ${user.name || "User"}`;
        if (loginBtn) loginBtn.style.display = "none";
        if (logoutBtn) logoutBtn.style.display = "inline-flex";
    } else {
        if (username) username.innerText = "";
        if (loginBtn) loginBtn.style.display = "inline-flex";
        if (logoutBtn) logoutBtn.style.display = "none";
    }
}

loginBtn?.addEventListener("click", () => window.location.href = "login.html");
logoutBtn?.addEventListener("click", () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    checkLogin();
    window.location.reload();
});

updateCartCount();
checkLogin();
loadProducts();

window.addEventListener("storage", updateCartCount);
