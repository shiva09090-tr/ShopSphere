const productsDiv = document.getElementById("products");

const search = document.getElementById("search");
const categoryFilter = document.getElementById("categoryFilter");
const minPrice = document.getElementById("minPrice");
const maxPrice = document.getElementById("maxPrice");
const sortBy = document.getElementById("sortBy");

const cartCount = document.getElementById("cartCount");

const API_URL = "https://shopsphere-sedh.onrender.com/api/products";

let allProducts = [];

updateCartCount();

async function loadProducts(){

    try{

        const res = await fetch(API_URL);

        const result = await res.json();

        allProducts = result.data;

        loadCategories();

        filterProducts();

    }

    catch(err){

        console.log(err);

    }

}
function loadCategories(){

    categoryFilter.innerHTML =

    `<option value="">All Categories</option>`;

    const categories =

    [...new Set(allProducts.map(item=>item.category))];

    categories.forEach(category=>{

        categoryFilter.innerHTML +=

        `<option value="${category}">

        ${category}

        </option>`;

    });

}
function displayProducts(products){

    productsDiv.innerHTML="";

    if(products.length===0){

        productsDiv.innerHTML="<h2>No Products Found</h2>";

        return;

    }

    products.forEach(product=>{

        productsDiv.innerHTML+=`

        <div class="card">

            <img src="${product.image}" alt="${product.name}">

            <h3>${product.name}</h3>

            <p>${product.description}</p>

            <h2 class="price">

            ₹${product.price}

            </h2>

            <div class="rating">

            ⭐⭐⭐⭐⭐

            </div>

            ${

            product.stock==0 ?

            `<span class="badge">

            ❌ Out Of Stock

            </span>`

            :

            ""

            }

            <div class="buttons">

            <button

            class="cartBtn"

            onclick="addToCart('${product._id}')">

            Add To Cart

            </button>

            <button

            onclick="viewProduct('${product._id}')">

            View Details

            </button>

            </div>

        </div>

        `;

    });

}

function filterProducts(){

    let products = [...allProducts];

    // Search
    if(search.value.trim() !== ""){

        products = products.filter(product=>

            product.name.toLowerCase().includes(

                search.value.toLowerCase()

            )

        );

    }

    // Category
    if(categoryFilter.value !== ""){

        products = products.filter(product=>

            product.category === categoryFilter.value

        );

    }

    // Minimum Price
    if(minPrice.value !== ""){

        products = products.filter(product=>

            product.price >= Number(minPrice.value)

        );

    }

    // Maximum Price
    if(maxPrice.value !== ""){

        products = products.filter(product=>

            product.price <= Number(maxPrice.value)

        );

    }

    // Sorting
    if(sortBy.value === "low"){

        products.sort((a,b)=>a.price-b.price);

    }

    else if(sortBy.value === "high"){

        products.sort((a,b)=>b.price-a.price);

    }

    else if(sortBy.value === "new"){

        products.reverse();

    }

    displayProducts(products);

}
search.addEventListener("keyup",filterProducts);

categoryFilter.addEventListener("change",filterProducts);

minPrice.addEventListener("input",filterProducts);

maxPrice.addEventListener("input",filterProducts);

sortBy.addEventListener("change",filterProducts);
function addToCart(id){

    const product = allProducts.find(item => item._id === id);

    if(!product){
        return;
    }

    if(product.stock <= 0){

        Swal.fire({
            icon:"error",
            title:"Out Of Stock",
            text:"This product is currently unavailable."
        });

        return;
    }

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existingProduct = cart.find(item => item._id === id);

    if(existingProduct){

        existingProduct.quantity++;

    }else{

        cart.push({

            ...product,

            quantity:1

        });

    }

    localStorage.setItem("cart",JSON.stringify(cart));

    updateCartCount();

    Swal.fire({

        icon:"success",

        title:"Added To Cart",

        timer:1200,

        showConfirmButton:false

    });

}
function updateCartCount(){

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    let total = 0;

    cart.forEach(item=>{

        total += item.quantity;

    });

    cartCount.innerText = total;

}
function viewProduct(id){

    const product = allProducts.find(item=>item._id===id);

    if(!product){
        return;
    }

    localStorage.setItem(

        "selectedProduct",

        JSON.stringify(product)

    );

    window.location.href="product.html";

}
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const username = document.getElementById("username");

function checkLogin(){

    const user = JSON.parse(localStorage.getItem("user"));

    if(user){

        username.innerText = "Hello, " + user.name;

        loginBtn.style.display = "none";

        logoutBtn.style.display = "inline-block";

    }

    else{

        username.innerText = "";

        loginBtn.style.display = "inline-block";

        logoutBtn.style.display = "none";

    }

}

checkLogin();

loginBtn.onclick = ()=>{

    window.location.href = "login.html";

}

logoutBtn.onclick = ()=>{

    localStorage.removeItem("user");
    localStorage.removeItem("token");

    Swal.fire({

        icon:"success",

        title:"Logged Out"

    }).then(()=>{

        location.reload();

    });

}
loadProducts();
const themeToggle = document.getElementById("themeToggle");

if(localStorage.getItem("theme")==="dark"){

    document.body.classList.add("dark");

    themeToggle.innerHTML="☀️";

}

themeToggle.onclick=()=>{

    document.body.classList.toggle("dark");

    if(document.body.classList.contains("dark")){

        localStorage.setItem("theme","dark");

        themeToggle.innerHTML="☀️";

    }

    else{

        localStorage.setItem("theme","light");

        themeToggle.innerHTML="🌙";

    }

}