// ======================================================
// SHOPSPHERE ADMIN - PRODUCT MANAGEMENT
// ======================================================

const API =
    "https://shopsphere-sedh.onrender.com/api/products";

const form =
    document.getElementById("productForm");

const productList =
    document.getElementById("productList");

const submitBtn =
    document.getElementById("submitBtn");

const cancelEditBtn =
    document.getElementById("cancelEditBtn");

const imageInput =
    document.getElementById("image");

const preview =
    document.getElementById("preview");

const featuredInput =
    document.getElementById("featured");

let editId = null;


// ======================================================
// ADMIN LOGIN CHECK
// ======================================================

if (localStorage.getItem("admin") !== "true") {

    alert("Please login first.");

    window.location.href =
        "adminLogin.html";
}


// ======================================================
// LOAD PRODUCTS
// ======================================================

async function loadProducts() {

    try {

        const res =
            await fetch(API);

        const result =
            await res.json();

        console.log(
            "Products API Response:",
            result
        );

        productList.innerHTML = "";

        if (
            !result.success ||
            !Array.isArray(result.data)
        ) {

            productList.innerHTML =
                "<p>Unable to load products.</p>";

            return;
        }


        if (result.data.length === 0) {

            productList.innerHTML =
                "<p>No products found.</p>";

            return;
        }


        result.data.forEach(product => {

            productList.innerHTML += `

                <div class="card product-admin-card">

                    <div class="admin-product-image">

                        <img
                            src="${
                                product.image ||
                                "https://via.placeholder.com/300?text=No+Image"
                            }"
                            alt="${product.name || "Product"}"
                            onerror="
                                this.src='https://via.placeholder.com/300?text=No+Image'
                            "
                        >

                    </div>


                    <div class="admin-product-info">

                        <span class="admin-category">

                            ${
                                product.category ||
                                "Product"
                            }

                        </span>


                        <h2>
                            ${product.name || ""}
                        </h2>


                        <p>
                            ${
                                product.description ||
                                ""
                            }
                        </p>


                        <h3>
                            ₹${
                                Number(
                                    product.price || 0
                                ).toLocaleString("en-IN")
                            }
                        </h3>


                        <p>
                            Stock:
                            ${product.stock || 0}
                        </p>


                        <p class="featured-status">

                            ${
                                product.featured
                                    ? "⭐ Showing in Home Slider"
                                    : "○ Not in Home Slider"
                            }

                        </p>


                        <div class="admin-product-actions">

                            <button
                                type="button"
                                onclick="editProduct('${product._id}')"
                            >
                                Edit
                            </button>


                            <button
                                type="button"
                                class="deleteBtn"
                                onclick="deleteProduct('${product._id}')"
                            >
                                Delete
                            </button>

                        </div>

                    </div>

                </div>

            `;

        });

    }

    catch (error) {

        console.error(
            "Load Products Error:",
            error
        );

        productList.innerHTML =
            "<p>Unable to load products.</p>";

    }

}


// ======================================================
// ADD / UPDATE PRODUCT
// ======================================================

form.addEventListener(
    "submit",
    async (e) => {

        e.preventDefault();


        // ==================================================
        // GET VALUES
        // ==================================================

        const imageURL =
            imageInput.value.trim();


        const productData = {

            name:
                document
                    .getElementById("name")
                    .value
                    .trim(),

            description:
                document
                    .getElementById("description")
                    .value
                    .trim(),

            price:
                Number(
                    document
                        .getElementById("price")
                        .value
                ),

            category:
                document
                    .getElementById("category")
                    .value
                    .trim(),

            brand:
                document
                    .getElementById("brand")
                    .value
                    .trim(),

            stock:
                Number(
                    document
                        .getElementById("stock")
                        .value
                ),

            image:
                imageURL,

            featured:
                featuredInput.checked

        };


        // ==================================================
        // DEBUG
        // ==================================================

        console.log(
            "IMAGE URL BEING SENT:",
            productData.image
        );

        console.log(
            "PRODUCT DATA:",
            productData
        );


        // ==================================================
        // VALIDATION
        // ==================================================

        if (!productData.name) {

            Swal.fire({

                icon: "warning",

                title:
                    "Product Name Required"

            });

            return;
        }


        if (!productData.image) {

            Swal.fire({

                icon: "warning",

                title:
                    "Image URL Required",

                text:
                    "Please enter product image URL."

            });

            return;
        }


        // ==================================================
        // BUTTON DISABLE
        // ==================================================

        submitBtn.disabled = true;

        submitBtn.innerText =
            editId
                ? "Updating..."
                : "Adding...";


        // ==================================================
        // API URL
        // ==================================================

        const url =
            editId
                ? `${API}/${editId}`
                : API;


        const method =
            editId
                ? "PUT"
                : "POST";


        try {

            // ==================================================
            // SEND JSON
            // ==================================================

            const res =
                await fetch(
                    url,
                    {

                        method:

                            method,

                        headers:
                            {

                                "Content-Type":
                                    "application/json"

                            },

                        body:
                            JSON.stringify(
                                productData
                            )

                    }
                );


            // ==================================================
            // RESPONSE
            // ==================================================

            const responseText =
                await res.text();


            console.log(
                "PRODUCT API STATUS:",
                res.status
            );

            console.log(
                "PRODUCT API RESPONSE:",
                responseText
            );


            if (!res.ok) {

                throw new Error(

                    responseText ||
                    `Request failed with status ${res.status}`

                );

            }


            let result;

            try {

                result =
                    JSON.parse(
                        responseText
                    );

            }

            catch (error) {

                throw new Error(
                    "Server returned invalid JSON."
                );

            }


            console.log(
                "PRODUCT RESULT:",
                result
            );


            // ==================================================
            // SUCCESS
            // ==================================================

            await Swal.fire({

                icon:
                    "success",

                title:
                    editId
                        ? "Product Updated"
                        : "Product Added",

                text:
                    editId
                        ? "Product updated successfully."
                        : "Product added successfully.",

                timer:
                    1300,

                showConfirmButton:
                    false

            });


            // ==================================================
            // RESET
            // ==================================================

            resetForm();


            // ==================================================
            // RELOAD PRODUCTS
            // ==================================================

            await loadProducts();

        }


        catch (error) {

            console.error(
                "PRODUCT ERROR:",
                error
            );


            Swal.fire({

                icon:
                    "error",

                title:
                    "Error",

                text:
                    error.message

            });

        }


        finally {

            submitBtn.disabled =
                false;

            submitBtn.innerText =
                editId
                    ? "Update Product"
                    : "Add Product";

        }

    }
);


// ======================================================
// EDIT PRODUCT
// ======================================================

async function editProduct(id) {

    try {

        const res =
            await fetch(
                `${API}/${id}`
            );


        const result =
            await res.json();


        if (!res.ok) {

            throw new Error(

                result.message ||
                "Product not found"

            );

        }


        const product =
            result.data;


        // ==================================================
        // FILL FORM
        // ==================================================

        document.getElementById(
            "name"
        ).value =
            product.name || "";


        document.getElementById(
            "description"
        ).value =
            product.description || "";


        document.getElementById(
            "price"
        ).value =
            product.price || "";


        document.getElementById(
            "category"
        ).value =
            product.category || "";


        document.getElementById(
            "brand"
        ).value =
            product.brand || "";


        document.getElementById(
            "stock"
        ).value =
            product.stock ?? 0;


        featuredInput.checked =
            Boolean(
                product.featured
            );


        // ==================================================
        // IMAGE URL
        // ==================================================

        imageInput.value =
            product.image || "";


        if (product.image) {

            preview.src =
                product.image;

            preview.style.display =
                "block";

        }

        else {

            preview.src =
                "";

            preview.style.display =
                "none";

        }


        // ==================================================
        // EDIT MODE
        // ==================================================

        editId =
            id;


        submitBtn.innerText =
            "Update Product";


        cancelEditBtn.style.display =
            "inline-block";


        document.getElementById(
            "productFormTitle"
        ).innerText =
            "Update Product";


        window.scrollTo({

            top:
                document
                    .getElementById(
                        "productForm"
                    )
                    .offsetTop - 20,

            behavior:
                "smooth"

        });

    }


    catch (error) {

        console.error(
            "Edit Product Error:",
            error
        );


        Swal.fire({

            icon:
                "error",

            title:
                "Error",

            text:
                error.message

        });

    }

}


window.editProduct =
    editProduct;


// ======================================================
// DELETE PRODUCT
// ======================================================

async function deleteProduct(id) {

    const confirm =
        await Swal.fire({

            title:
                "Delete Product?",

            text:
                "This cannot be undone.",

            icon:
                "warning",

            showCancelButton:
                true,

            confirmButtonText:
                "Delete",

            cancelButtonText:
                "Cancel"

        });


    if (!confirm.isConfirmed) {

        return;

    }


    try {

        const res =
            await fetch(

                `${API}/${id}`,

                {

                    method:
                        "DELETE"

                }

            );


        const result =
            await res.json();


        if (!res.ok) {

            throw new Error(

                result.message ||
                "Delete failed"

            );

        }


        await Swal.fire({

            icon:
                "success",

            title:
                "Product Deleted",

            timer:
                1200,

            showConfirmButton:
                false

        });


        await loadProducts();

    }


    catch (error) {

        console.error(
            "Delete Product Error:",
            error
        );


        Swal.fire({

            icon:
                "error",

            title:
                "Error",

            text:
                error.message

        });

    }

}


window.deleteProduct =
    deleteProduct;


// ======================================================
// RESET FORM
// ======================================================

function resetForm() {

    form.reset();

    editId =
        null;


    submitBtn.innerText =
        "Add Product";


    cancelEditBtn.style.display =
        "none";


    document.getElementById(
        "productFormTitle"
    ).innerText =
        "Add / Update Product";


    preview.src =
        "";

    preview.style.display =
        "none";

}


// ======================================================
// CANCEL EDIT
// ======================================================

cancelEditBtn?.addEventListener(
    "click",
    resetForm
);


// ======================================================
// IMAGE URL PREVIEW
// ======================================================

imageInput?.addEventListener(
    "input",
    () => {

        const url =
            imageInput.value.trim();


        if (!url) {

            preview.src =
                "";

            preview.style.display =
                "none";

            return;

        }


        preview.src =
            url;

        preview.style.display =
            "block";

    }
);


// ======================================================
// IMAGE ERROR
// ======================================================

preview?.addEventListener(
    "error",
    () => {

        preview.style.display =
            "none";

    }
);


// ======================================================
// LOGOUT
// ======================================================

document
    .getElementById("logoutBtn")
    ?.addEventListener(
        "click",
        () => {

            localStorage.removeItem(
                "admin"
            );

            window.location.href =
                "adminLogin.html";

        }
    );


// ======================================================
// INITIAL LOAD
// ======================================================

loadProducts();