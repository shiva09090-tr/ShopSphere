let cart = JSON.parse(localStorage.getItem("cart")) || [];

const cartItems = document.getElementById("cartItems");
const totalPrice = document.getElementById("totalPrice");
const clearCart = document.getElementById("clearCart");

function renderCart(){

    cartItems.innerHTML="";

    let total=0;

    cart.forEach((product,index)=>{

        total += product.price;

        cartItems.innerHTML += `

        <div class="cart-card">

            <img src="https://picsum.photos/300/200?random=${product._id}">

            <div class="info">

                <h2>${product.name}</h2>

                <p>${product.description}</p>

                <h3 class="price">₹${product.price}</h3>

                <div class="quantity">

                    <button onclick="decrease(${index})">-</button>

                    <span>1</span>

                    <button onclick="increase(${index})">+</button>

                </div>

            </div>

            <button class="remove" onclick="removeItem(${index})">

                Remove

            </button>

        </div>

        `;

    });

    totalPrice.textContent = total;

}

function removeItem(index){

    cart.splice(index,1);

    localStorage.setItem("cart",JSON.stringify(cart));

    renderCart();

}

function increase(index){

    cart.push(cart[index]);

    localStorage.setItem("cart",JSON.stringify(cart));

    renderCart();

}

function decrease(index){

    cart.splice(index,1);

    localStorage.setItem("cart",JSON.stringify(cart));

    renderCart();

}

clearCart.onclick=()=>{

    cart=[];

    localStorage.removeItem("cart");

    renderCart();

}

renderCart();
const buyNowBtn = document.getElementById("buyNowBtn");

buyNowBtn.addEventListener("click", () => {

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    if(cart.length === 0){

        Swal.fire({
    icon:"info",
    title:"Cart Empty",
    text:"Please add products first."
});

        return;

    }

    window.location.href = "checkout.html";

});