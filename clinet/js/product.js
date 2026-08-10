// ================================================
// GET SELECTED PRODUCT
// ================================================

const product = JSON.parse(
    localStorage.getItem("selectedProduct")
);


// ================================================
// CHECK PRODUCT
// ================================================

if (!product) {

    Swal.fire({
        icon: "error",
        title: "Product Not Found",
        text: "Please select a product first."
    }).then(() => {
        window.location.href = "index.html";
    });

} else {

    // ============================================
    // PRODUCT DETAILS
    // ============================================

    const productImage =
        document.getElementById("productImage");

    const productName =
        document.getElementById("productName");

    const brand =
        document.getElementById("brand");

    const description =
        document.getElementById("description");

    const price =
        document.getElementById("price");

    const buttonArea =
        document.getElementById("buttonArea");


    // ============================================
    // IMAGE
    // ============================================

    if (productImage) {

        productImage.src =
            product.image ||
            "https://via.placeholder.com/700x600?text=ShopSphere";

        productImage.alt =
            product.name || "Product";

        productImage.onerror = function () {

            this.src =
                "https://via.placeholder.com/700x600?text=ShopSphere";

        };
    }


    // ============================================
    // NAME
    // ============================================

    if (productName) {

        productName.textContent =
            product.name || "Product";
    }


    // ============================================
    // BRAND
    // ============================================

    if (brand) {

        brand.textContent =
            "Brand : " +
            (product.brand || "ShopSphere");
    }


    // ============================================
    // DESCRIPTION
    // ============================================

    if (description) {

        description.textContent =
            product.description ||
            "Discover this quality product at ShopSphere.";
    }


    // ============================================
    // PRICE
    // ============================================

    if (price) {

        price.textContent =
            "₹" +
            Number(product.price || 0)
                .toLocaleString("en-IN");
    }


    // ============================================
    // BUTTONS
    // ============================================

    if (buttonArea) {

        const stock =
            Number(product.stock) || 0;


        // ========================================
        // PRODUCT AVAILABLE
        // ========================================

        if (stock > 0) {

            buttonArea.innerHTML = `

                <button
                    type="button"
                    class="add-cart-btn"
                    id="cartBtn"
                >
                    <i class="fa-solid fa-cart-shopping"></i>
                    Add to Cart
                </button>


                <button
                    type="button"
                    class="buy-now-btn"
                    id="buyBtn"
                >
                    <i class="fa-solid fa-bolt"></i>
                    Buy Now
                </button>

            `;


            // ====================================
            // ADD TO CART
            // ====================================

            document
                .getElementById("cartBtn")
                ?.addEventListener(
                    "click",
                    function () {

                        let cart =
                            JSON.parse(
                                localStorage.getItem("cart")
                            ) || [];


                        // Find existing product

                        const existingProduct =
                            cart.find(
                                item =>
                                    item._id === product._id
                            );


                        // =================================
                        // ALREADY IN CART
                        // =================================

                        if (existingProduct) {

                            const currentQuantity =
                                Number(
                                    existingProduct.quantity
                                ) || 1;


                            // Stock limit

                            if (
                                currentQuantity >= stock
                            ) {

                                Swal.fire({

                                    icon: "warning",

                                    title: "Stock Limit",

                                    text:
                                        "You cannot add more than available stock."

                                });

                                return;
                            }


                            existingProduct.quantity =
                                currentQuantity + 1;

                        }


                        // =================================
                        // NEW PRODUCT
                        // =================================

                        else {

                            cart.push({

                                _id:
                                    product._id,

                                name:
                                    product.name,

                                description:
                                    product.description || "",

                                price:
                                    Number(product.price) || 0,

                                brand:
                                    product.brand || "",

                                image:
                                    product.image || "",

                                featured:
                                    product.featured || false,

                                category:
                                    product.category || "",

                                quantity:
                                    1

                            });

                        }


                        // Save cart

                        localStorage.setItem(
                            "cart",
                            JSON.stringify(cart)
                        );


                        // Success message

                        Swal.fire({

                            icon: "success",

                            title: "Added To Cart",

                            text:
                                product.name +
                                " has been added to your cart.",

                            timer: 1300,

                            showConfirmButton: false

                        });

                    }
                );


            // ========================================
            // BUY NOW
            // ========================================

            document
                .getElementById("buyBtn")
                ?.addEventListener(
                    "click",
                    function () {

                        let cart =
                            JSON.parse(
                                localStorage.getItem("cart")
                            ) || [];


                        // Check whether product
                        // already exists

                        const existingProduct =
                            cart.find(
                                item =>
                                    item._id === product._id
                            );


                        if (existingProduct) {

                            existingProduct.quantity = 1;

                        } else {

                            cart.push({

                                _id:
                                    product._id,

                                name:
                                    product.name,

                                description:
                                    product.description || "",

                                price:
                                    Number(product.price) || 0,

                                brand:
                                    product.brand || "",

                                image:
                                    product.image || "",

                                category:
                                    product.category || "",

                                featured:
                                    product.featured || false,

                                quantity:
                                    1

                            });

                        }


                        // Save cart

                        localStorage.setItem(
                            "cart",
                            JSON.stringify(cart)
                        );


                        // Go checkout

                        window.location.href =
                            "checkout.html";

                    }
                );

        }


        // ========================================
        // OUT OF STOCK
        // ========================================

        else {

            buttonArea.innerHTML = `

                <button
                    type="button"
                    class="outStockBtn"
                    disabled
                >
                    <i class="fa-solid fa-box-open"></i>
                    Out Of Stock
                </button>

            `;

        }

    }

}