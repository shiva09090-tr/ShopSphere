const API = "http://localhost:5000/api/products";

const form = document.getElementById("productForm");
const productList = document.getElementById("productList");

let editId = null;
const submitBtn = document.getElementById("submitBtn");
// Check Admin Login

if (localStorage.getItem("admin") !== "true") {

    alert("Please login first.");

    window.location.href = "adminLogin.html";

}

// Load Products
async function loadProducts() {

    const res = await fetch(API);

    const result = await res.json();

    productList.innerHTML = "";

    result.data.forEach((product) => {
        productList.innerHTML += `
<div class="card">
    <img src="${product.image}" width="150">
    <h2>${product.name}</h2>
    <p>${product.description}</p>
    <h3>₹${product.price}</h3>
    <button onclick="editProduct('${product._id}')">
        Edit
    </button>
    <button class="deleteBtn"
    onclick="deleteProduct('${product._id}')">
        Delete
    </button>
</div>
`;
    });
}

// Add Product
form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const formData = new FormData();

formData.append("name", document.getElementById("name").value);
formData.append("description", document.getElementById("description").value);
formData.append("price", document.getElementById("price").value);
formData.append("category", document.getElementById("category").value);
formData.append("brand", document.getElementById("brand").value);
formData.append("stock", document.getElementById("stock").value);

const imageFile = document.getElementById("image").files[0];

if(imageFile){

    formData.append("image", imageFile);

}

    if (editId) {

        await fetch(API + "/" + editId, {

    method: "PUT",

    body: formData

});

        editId = null;
        submitBtn.innerText = "Add Product";

    } else {

        await fetch(API, {

            method: "POST",

            body: formData

        });

        Swal.fire({
            icon: "success",
            title: "Product Added Successfully",
            timer: 1500,
            showConfirmButton: false
        });

    }

    form.reset();

    loadProducts();

});

// Delete Product
async function deleteProduct(id){

    await fetch(API + "/" + id, {

        method: "DELETE"

    });

    loadProducts();

}
async function editProduct(id) {

    const res = await fetch(API + "/" + id);
    const result = await res.json();

    const product = result.data;

    document.getElementById("name").value = product.name;
    document.getElementById("description").value = product.description;
    document.getElementById("price").value = product.price;
    document.getElementById("category").value = product.category;
    document.getElementById("brand").value = product.brand;
    document.getElementById("stock").value = product.stock;
    document.getElementById("image").value = product.image;
    preview.src = product.image;
    preview.style.display = "block";

    editId = id;

    submitBtn.innerText = "Update Product";
}

loadProducts();
const imageInput = document.getElementById("image");

const preview = document.getElementById("preview");

imageInput.addEventListener("change",()=>{

    const file = imageInput.files[0];

    if(file){

        preview.src = URL.createObjectURL(file);

        preview.style.display = "block";

    }else{

        preview.style.display = "none";

    }

});
const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", () => {

    localStorage.removeItem("admin");

    logoutBtn.addEventListener("click",()=>{

    localStorage.removeItem("admin");

    Swal.fire({
        icon:"success",
        title:"Logged Out",
        timer:1200,
        showConfirmButton:false
    });

    setTimeout(()=>{
        window.location.href="adminLogin.html";
    },1200);

});

    window.location.href = "adminLogin.html";

});
async function loadDashboardStats() {

    try {

        const res = await fetch("http://localhost:5000/api/dashboard-stats");

        const data = await res.json();

        console.log(data);

        document.getElementById("products").innerText = data.totalProducts;

        document.getElementById("orders").innerText = data.totalOrders;

        document.getElementById("pending").innerText = data.pendingOrders;

        document.getElementById("delivered").innerText = data.deliveredOrders;

        document.getElementById("cancelled").innerText = data.cancelledOrders;

        document.getElementById("revenue").innerText = "₹" + data.totalRevenue;

    } catch (err) {

        console.log(err);

    }

}

loadDashboardStats();
async function loadNotifications(){

    const res = await fetch(
        "http://localhost:5000/api/admin/orders"
    );

    const result = await res.json();

    const pending = result.data.filter(order=>
        order.status==="Pending"
    );

    document.getElementById("newOrders").innerText =
        pending.length;

}

loadNotifications();

setInterval(loadNotifications,5000);
async function loadRecentOrders(){

    const res = await fetch("http://localhost:5000/api/admin/orders");

    const result = await res.json();

    const tbody = document.getElementById("recentOrdersBody");

    if(!tbody) return;

    tbody.innerHTML = "";

    result.data.slice(0,5).forEach(order=>{

        tbody.innerHTML += `
        <tr>
            <td>${order.customerName}</td>
            <td>${order.phone}</td>
            <td>${order.status}</td>
            <td>₹${order.totalPrice}</td>
            <td>${new Date(order.createdAt).toLocaleDateString()}</td>
        </tr>
        `;

    });

}

loadRecentOrders();
async function loadLowStock(){

    const res = await fetch("http://localhost:5000/api/products");

    const result = await res.json();

    const box = document.getElementById("lowStockList");

    if(!box) return;

    box.innerHTML="";

    result.data.forEach(product=>{

        if(product.stock<=5){

            box.innerHTML+=`

            <div class="lowItem">

                <span>${product.name}</span>

                <b>${product.stock} Left</b>

            </div>

            `;

        }

    });

}

loadLowStock();