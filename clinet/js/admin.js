const API = "https://shopsphere-sedh.onrender.com/api/products";
const form = document.getElementById("productForm");
const productList = document.getElementById("productList");
const submitBtn = document.getElementById("submitBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");
const imageInput = document.getElementById("image");
const preview = document.getElementById("preview");
const featuredInput = document.getElementById("featured");
let editId = null;

if (localStorage.getItem("admin") !== "true") {
    alert("Please login first.");
    window.location.href = "adminLogin.html";
}

async function loadProducts() {
    try {
        const res = await fetch(API);
        const result = await res.json();
        productList.innerHTML = "";

        result.data.forEach(product => {
            productList.innerHTML += `
            <div class="card product-admin-card">
                <div class="admin-product-image"><img src="${product.image || 'https://via.placeholder.com/150?text=No+Image'}" alt="${product.name}"></div>
                <div class="admin-product-info">
                    <span class="admin-category">${product.category || 'Product'}</span>
                    <h2>${product.name}</h2>
                    <p>${product.description}</p>
                    <h3>₹${Number(product.price).toLocaleString('en-IN')}</h3>
                    <p>Stock: ${product.stock}</p>
                    <p class="featured-status">${product.featured ? '⭐ Showing in Home Slider' : '○ Not in Home Slider'}</p>
                    <div class="admin-product-actions">
                        <button type="button" onclick="editProduct('${product._id}')">Edit</button>
                        <button type="button" class="deleteBtn" onclick="deleteProduct('${product._id}')">Delete</button>
                    </div>
                </div>
            </div>`;
        });
    } catch (error) {
        console.error(error);
        productList.innerHTML = "<p>Unable to load products.</p>";
    }
}

form.addEventListener("submit", async e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", document.getElementById("name").value.trim());
    formData.append("description", document.getElementById("description").value.trim());
    formData.append("price", document.getElementById("price").value);
    formData.append("category", document.getElementById("category").value.trim());
    formData.append("brand", document.getElementById("brand").value.trim());
    formData.append("stock", document.getElementById("stock").value);
    formData.append("featured", featuredInput.checked ? "true" : "false");

    if (imageInput.files[0]) formData.append("image", imageInput.files[0]);

    try {
        const url = editId ? `${API}/${editId}` : API;
        const method = editId ? "PUT" : "POST";
        const res = await fetch(url, { method, body: formData });
        const result = await res.json();
        if (!res.ok) throw new Error(result.message || "Request failed");

        await Swal.fire({ icon: "success", title: editId ? "Product Updated" : "Product Added", timer: 1300, showConfirmButton: false });
        resetForm();
        loadProducts();
    } catch (error) {
        Swal.fire({ icon: "error", title: "Error", text: error.message });
    }
});

async function editProduct(id) {
    try {
        const res = await fetch(`${API}/${id}`);
        const result = await res.json();
        if (!res.ok) throw new Error(result.message || "Product not found");
        const product = result.data;

        document.getElementById("name").value = product.name || "";
        document.getElementById("description").value = product.description || "";
        document.getElementById("price").value = product.price || "";
        document.getElementById("category").value = product.category || "";
        document.getElementById("brand").value = product.brand || "";
        document.getElementById("stock").value = product.stock ?? 0;
        featuredInput.checked = Boolean(product.featured);
        imageInput.value = "";

        if (product.image) {
            preview.src = product.image;
            preview.style.display = "block";
        } else {
            preview.style.display = "none";
        }

        editId = id;
        submitBtn.innerText = "Update Product";
        cancelEditBtn.style.display = "inline-block";
        document.getElementById("productFormTitle").innerText = "Update Product";
        window.scrollTo({ top: document.getElementById("productForm").offsetTop - 20, behavior: "smooth" });
    } catch (error) {
        Swal.fire({ icon: "error", title: "Error", text: error.message });
    }
}
window.editProduct = editProduct;

async function deleteProduct(id) {
    const confirm = await Swal.fire({ title: "Delete Product?", text: "This cannot be undone.", icon: "warning", showCancelButton: true, confirmButtonText: "Delete" });
    if (!confirm.isConfirmed) return;
    try {
        const res = await fetch(`${API}/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Delete failed");
        loadProducts();
    } catch (error) {
        Swal.fire({ icon: "error", title: "Error", text: error.message });
    }
}
window.deleteProduct = deleteProduct;

function resetForm() {
    form.reset();
    editId = null;
    submitBtn.innerText = "Add Product";
    cancelEditBtn.style.display = "none";
    document.getElementById("productFormTitle").innerText = "Add / Update Product";
    preview.src = "";
    preview.style.display = "none";
}
cancelEditBtn?.addEventListener("click", resetForm);

imageInput?.addEventListener("change", () => {
    const file = imageInput.files[0];
    if (!file) return;
    preview.src = URL.createObjectURL(file);
    preview.style.display = "block";
});

document.getElementById("logoutBtn")?.addEventListener("click", async () => {
    localStorage.removeItem("admin");
    window.location.href = "adminLogin.html";
});

loadProducts();
