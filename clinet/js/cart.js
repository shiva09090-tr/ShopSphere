let cart = JSON.parse(localStorage.getItem("cart")) || [];

const cartItems = document.getElementById("cartItems");
const totalPrice = document.getElementById("totalPrice");
const clearCart = document.getElementById("clearCart");

// ======================================================
// RENDER CART
// ======================================================

function renderCart() {

    cartItems.innerHTML = "";

    let total = 0;

    if (cart.length === 0) {

        cartItems.innerHTML = `
            <div class="empty-cart">
                <h2>Your Cart is Empty</h2>
                <p>Add some products to continue shopping.</p>
            </div>
        `;

        totalPrice.textContent = "₹0";
        return;
    }


    cart.forEach((product, index) => {

        const quantity =
            Number(product.quantity) || 1;

        const price =
            Number(product.price) || 0;

        const subtotal =
            price * quantity;

        total += subtotal;


        cartItems.innerHTML += `

            <div class="cart-card">

                <img
                    src="${product.image || 'https://via.placeholder.com/200?text=No+Image'}"
                    alt="${product.name || 'Product'}"
                    class="cart-product-image"
                >

                <div class="info">

                    <h2>
                        ${product.name || "Product"}
                    </h2>

                    <p>
                        ${product.description || ""}
                    </p>

                    <h3 class="price">
                        ₹${price.toLocaleString("en-IN")}
                    </h3>


                    <div class="quantity">

                        <button
                            type="button"
                            onclick="decrease(${index})"
                        >
                            -
                        </button>


                        <span>
                            ${quantity}
                        </span>


                        <button
                            type="button"
                            onclick="increase(${index})"
                        >
                            +
                        </button>

                    </div>


                    <p class="subtotal">
                        Subtotal:
                        <strong>
                            ₹${subtotal.toLocaleString("en-IN")}
                        </strong>
                    </p>

                </div>


                <button
                    type="button"
                    class="remove"
                    onclick="removeItem(${index})"
                >
                    Remove
                </button>

            </div>

        `;

    });


    totalPrice.textContent =
        `₹${total.toLocaleString("en-IN")}`;
}


// ======================================================
// REMOVE PRODUCT
// ======================================================

function removeItem(index) {

    cart.splice(index, 1);

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    renderCart();

}


// ======================================================
// INCREASE QUANTITY
// ======================================================

function increase(index) {

    if (!cart[index]) return;


    const currentQuantity =
        Number(cart[index].quantity) || 1;


    cart[index].quantity =
        currentQuantity + 1;


    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );


    renderCart();

}


// ======================================================
// DECREASE QUANTITY
// ======================================================

function decrease(index) {

    if (!cart[index]) return;


    const currentQuantity =
        Number(cart[index].quantity) || 1;


    // If quantity is 1, remove product

    if (currentQuantity <= 1) {

        cart.splice(index, 1);

    } else {

        cart[index].quantity =
            currentQuantity - 1;

    }


    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );


    renderCart();

}


// ======================================================
// CLEAR CART
// ======================================================

if (clearCart) {

    clearCart.onclick = () => {

        if (cart.length === 0) {
            return;
        }


        Swal.fire({

            icon: "warning",

            title: "Clear Cart?",

            text: "All products will be removed from your cart.",

            showCancelButton: true,

            confirmButtonText: "Yes, Clear Cart",

            cancelButtonText: "Cancel"

        }).then((result) => {

            if (result.isConfirmed) {

                cart = [];

                localStorage.removeItem("cart");

                renderCart();

            }

        });

    };

}


// ======================================================
// BUY NOW
// ======================================================

const buyNowBtn =
    document.getElementById("buyNowBtn");


if (buyNowBtn) {

    buyNowBtn.addEventListener(
        "click",
        () => {


            // ------------------------------------------
            // CHECK CART
            // ------------------------------------------

            const currentCart =
                JSON.parse(
                    localStorage.getItem("cart")
                ) || [];


            if (currentCart.length === 0) {

                Swal.fire({

                    icon: "info",

                    title: "Cart Empty",

                    text:
                        "Please add products first."

                });

                return;

            }


            // ------------------------------------------
            // CHECK LOGIN
            // ------------------------------------------

            const user =
                JSON.parse(
                    localStorage.getItem("user")
                );


            if (!user) {

                Swal.fire({

                    icon: "warning",

                    title: "Login Required",

                    text:
                        "Please login before placing an order.",

                    showCancelButton: true,

                    confirmButtonText: "Login",

                    cancelButtonText: "Cancel"

                }).then((result) => {

                    if (result.isConfirmed) {

                        window.location.href =
                            "login.html";

                    }

                });

                return;

            }


            // ------------------------------------------
            // GO TO CHECKOUT
            // ------------------------------------------

            window.location.href =
                "checkout.html";

        }
    );

}


// ======================================================
// INITIAL LOAD
// ======================================================

renderCart();