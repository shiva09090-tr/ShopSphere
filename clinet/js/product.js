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

        window.location.href =
            "index.html";

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

    const thumbnailsContainer =
        document.getElementById(
            "productThumbnails"
        );


    // ============================================
    // PRODUCT IMAGES
    // ============================================

    let productImages = [];


    // New multiple-image field
    if (
        Array.isArray(product.images) &&
        product.images.length > 0
    ) {

        productImages = [
            ...product.images
        ];

    }


    // Old single-image field
    // Keep backward compatibility

    if (
        product.image &&
        !productImages.includes(
            product.image
        )
    ) {

        productImages.unshift(
            product.image
        );

    }


    // Remove empty values

    productImages =
        productImages.filter(
            image =>
                image &&
                String(image).trim() !== ""
        );


    // ============================================
    // SHOW MAIN IMAGE
    // ============================================

    if (productImage) {

        const firstImage =
            productImages[0] ||
            "https://via.placeholder.com/700x600?text=ShopSphere";


        productImage.src =
            firstImage;


        productImage.alt =
            product.name ||
            "Product";


        productImage.onerror =
            function () {

                this.src =
                    "https://via.placeholder.com/700x600?text=ShopSphere";

            };

    }


    // ============================================
    // SHOW THUMBNAILS
    // ============================================

    function showThumbnails() {

        if (!thumbnailsContainer) {
            return;
        }


        thumbnailsContainer.innerHTML = "";


        // No images
        if (
            productImages.length <= 1
        ) {

            return;

        }


        productImages.forEach(
            (image, index) => {


                const thumbnail =
                    document.createElement(
                        "button"
                    );


                thumbnail.type =
                    "button";


                thumbnail.className =
                    "product-thumbnail";


                if (index === 0) {

                    thumbnail.classList.add(
                        "active"
                    );

                }


                thumbnail.innerHTML = `

                    <img
                        src="${image}"
                        alt="${product.name || "Product"} image ${index + 1}"
                    >

                `;


                thumbnail.addEventListener(
                    "click",
                    function () {

                        if (productImage) {

                            productImage.src =
                                image;

                        }


                        document
                            .querySelectorAll(
                                ".product-thumbnail"
                            )
                            .forEach(
                                item =>
                                    item.classList.remove(
                                        "active"
                                    )
                            );


                        thumbnail.classList.add(
                            "active"
                        );

                    }
                );


                thumbnailsContainer.appendChild(
                    thumbnail
                );

            }
        );

    }


    showThumbnails();


    // ============================================
    // NAME
    // ============================================

    if (productName) {

        productName.textContent =
            product.name ||
            "Product";

    }


    // ============================================
    // BRAND
    // ============================================

    if (brand) {

        brand.textContent =
            "Brand : " +
            (
                product.brand ||
                "ShopSphere"
            );

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
            Number(
                product.price || 0
            ).toLocaleString(
                "en-IN"
            );

    }


    // ============================================
    // BUTTONS
    // ============================================

    if (buttonArea) {

        const stock =
            Number(
                product.stock
            ) || 0;


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

                    <i
                        class="fa-solid fa-cart-shopping"
                    ></i>

                    Add to Cart

                </button>


                <button
                    type="button"
                    class="buy-now-btn"
                    id="buyBtn"
                >

                    <i
                        class="fa-solid fa-bolt"
                    ></i>

                    Buy Now

                </button>

            `;


            // ====================================
            // ADD TO CART
            // ====================================

            document
                .getElementById(
                    "cartBtn"
                )
                ?.addEventListener(
                    "click",
                    function () {


                        let cart =
                            JSON.parse(
                                localStorage.getItem(
                                    "cart"
                                )
                            ) || [];


                        // =================================
                        // FIND EXISTING PRODUCT
                        // =================================

                        const existingProduct =
                            cart.find(
                                item =>
                                    item._id ===
                                    product._id
                            );


                        // =================================
                        // ALREADY IN CART
                        // =================================

                        if (
                            existingProduct
                        ) {

                            const currentQuantity =
                                Number(
                                    existingProduct.quantity
                                ) || 1;


                            // Stock limit

                            if (
                                currentQuantity >=
                                stock
                            ) {

                                Swal.fire({

                                    icon:
                                        "warning",

                                    title:
                                        "Stock Limit",

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
                                    product.description ||
                                    "",

                                price:
                                    Number(
                                        product.price
                                    ) || 0,

                                brand:
                                    product.brand ||
                                    "",

                                image:
                                    product.image ||
                                    productImages[0] ||
                                    "",

                                // NEW
                                images:
                                    productImages,

                                featured:
                                    product.featured ||
                                    false,

                                category:
                                    product.category ||
                                    "",

                                quantity:
                                    1

                            });

                        }


                        // =================================
                        // SAVE CART
                        // =================================

                        localStorage.setItem(
                            "cart",
                            JSON.stringify(
                                cart
                            )
                        );


                        // =================================
                        // SUCCESS
                        // =================================

                        Swal.fire({

                            icon:
                                "success",

                            title:
                                "Added To Cart",

                            text:
                                product.name +
                                " has been added to your cart.",

                            timer:
                                1300,

                            showConfirmButton:
                                false

                        });

                    }
                );


            // ========================================
            // BUY NOW
            // ========================================

            document
                .getElementById(
                    "buyBtn"
                )
                ?.addEventListener(
                    "click",
                    function () {


                        let cart =
                            JSON.parse(
                                localStorage.getItem(
                                    "cart"
                                )
                            ) || [];


                        // =================================
                        // CHECK EXISTING PRODUCT
                        // =================================

                        const existingProduct =
                            cart.find(
                                item =>
                                    item._id ===
                                    product._id
                            );


                        // =================================
                        // EXISTING
                        // =================================

                        if (
                            existingProduct
                        ) {

                            existingProduct.quantity =
                                1;


                            // Update images too

                            existingProduct.images =
                                productImages;


                            existingProduct.image =
                                product.image ||
                                productImages[0] ||
                                "";

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
                                    product.description ||
                                    "",

                                price:
                                    Number(
                                        product.price
                                    ) || 0,

                                brand:
                                    product.brand ||
                                    "",

                                image:
                                    product.image ||
                                    productImages[0] ||
                                    "",

                                // NEW
                                images:
                                    productImages,

                                category:
                                    product.category ||
                                    "",

                                featured:
                                    product.featured ||
                                    false,

                                quantity:
                                    1

                            });

                        }


                        // =================================
                        // SAVE CART
                        // =================================

                        localStorage.setItem(
                            "cart",
                            JSON.stringify(
                                cart
                            )
                        );


                        // =================================
                        // GO CHECKOUT
                        // =================================

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

                    <i
                        class="fa-solid fa-box-open"
                    ></i>

                    Out Of Stock

                </button>

            `;

        }

    }

}