const product = JSON.parse(localStorage.getItem("selectedProduct"));

document.getElementById("productImage").src = product.image;
document.getElementById("productName").textContent = product.name;
document.getElementById("brand").textContent = "Brand : " + product.brand;
document.getElementById("description").textContent = product.description;
document.getElementById("price").textContent = "₹" + product.price;
document.getElementById("category").textContent = "Category : " + product.category;
document.getElementById("stock").textContent = "Stock : " + product.stock;

const buttonArea = document.getElementById("buttonArea");

if (product.stock > 0) {

    buttonArea.innerHTML = `
        <button id="cartBtn">Add To Cart</button>
        <button id="buyBtn">Buy Now</button>
    `;

    document.getElementById("cartBtn").onclick = () => {

        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        const existing = cart.find(item => item._id === product._id);

        if (existing) {
            existing.quantity++;
        } else {
            cart.push({
                ...product,
                quantity: 1
            });
        }

        localStorage.setItem("cart", JSON.stringify(cart));

        Swal.fire({
            icon: "success",
            title: "Added To Cart",
            timer: 1200,
            showConfirmButton: false
        });

    };

    document.getElementById("buyBtn").onclick = () => {
        window.location.href = "checkout.html";
    };

} else {

    buttonArea.innerHTML = `
        <button class="outStockBtn" disabled>
            Out Of Stock
        </button>
    `;

}