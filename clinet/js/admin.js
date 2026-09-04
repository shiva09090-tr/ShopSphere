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

const image2Input =
    document.getElementById("image2");

const image3Input =
    document.getElementById("image3");

const image4Input =
    document.getElementById("image4");

const image5Input =
    document.getElementById("image5");

const preview =
    document.getElementById("preview");

const previewPlaceholder =
    document.getElementById("previewPlaceholder");

const featuredInput =
    document.getElementById("featured");

let editId = null;


// ======================================================
// ADMIN LOGIN CHECK
// ======================================================

if (
    localStorage.getItem("admin") !== "true"
) {

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


        if (
            result.data.length === 0
        ) {

            productList.innerHTML =
                "<p>No products found.</p>";

            return;

        }


        result.data.forEach(
            product => {


                const mainImage =
                    product.image ||
                    (
                        Array.isArray(
                            product.images
                        )
                            ?
                            product.images[0]
                            :
                            ""
                    ) ||
                    "https://via.placeholder.com/300?text=No+Image";


                productList.innerHTML += `

                    <div
                        class="card product-admin-card"
                    >

                        <div
                            class="admin-product-image"
                        >

                            <img
                                src="${mainImage}"
                                alt="${
                                    product.name ||
                                    "Product"
                                }"
                                onerror="
                                    this.src='https://via.placeholder.com/300?text=No+Image'
                                "
                            >

                        </div>


                        <div
                            class="admin-product-info"
                        >

                            <span
                                class="admin-category"
                            >

                                ${
                                    product.category ||
                                    "Product"
                                }

                            </span>


                            <h2>

                                ${
                                    product.name ||
                                    ""
                                }

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
                                        product.price ||
                                        0
                                    ).toLocaleString(
                                        "en-IN"
                                    )
                                }

                            </h3>


                            <p>

                                Stock:
                                ${
                                    product.stock ||
                                    0
                                }

                            </p>


                            <p
                                class="featured-status"
                            >

                                ${
                                    product.featured
                                        ?
                                    "⭐ Showing in Home Slider"
                                        :
                                    "○ Not in Home Slider"
                                }

                            </p>


                            <p
                                style="
                                    font-size:12px;
                                    color:#64748b;
                                "
                            >

                                ${
                                    Array.isArray(
                                        product.images
                                    )
                                    ?
                                    product.images.length
                                    : 1
                                }

                                image(s)

                            </p>


                            <div
                                class="admin-product-actions"
                            >

                                <button
                                    type="button"
                                    onclick="
                                        editProduct(
                                            '${product._id}'
                                        )
                                    "
                                >
                                    Edit
                                </button>


                                <button
                                    type="button"
                                    class="deleteBtn"
                                    onclick="
                                        deleteProduct(
                                            '${product._id}'
                                        )
                                    "
                                >
                                    Delete
                                </button>

                            </div>

                        </div>

                    </div>

                `;

            }
        );

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
// GET PRODUCT IMAGES
// ======================================================

function getProductImages() {

    const images = [];


    const image1 =
        imageInput?.value.trim() || "";

    const image2 =
        image2Input?.value.trim() || "";

    const image3 =
        image3Input?.value.trim() || "";

    const image4 =
        image4Input?.value.trim() || "";

    const image5 =
        image5Input?.value.trim() || "";


    if (image1) {
        images.push(image1);
    }

    if (image2) {
        images.push(image2);
    }

    if (image3) {
        images.push(image3);
    }

    if (image4) {
        images.push(image4);
    }

    if (image5) {
        images.push(image5);
    }


    return images;

}


// ======================================================
// ADD / UPDATE PRODUCT
// ======================================================

form.addEventListener(
    "submit",
    async (e) => {

        e.preventDefault();


        // ==================================================
        // GET IMAGES
        // ==================================================

        const images =
            getProductImages();


        const imageURL =
            images[0] || "";


        // ==================================================
        // PRODUCT DATA
        // ==================================================

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


            // Old field
            image:
                imageURL,


            // New multiple images field
            images:
                images,


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
            "MULTIPLE IMAGES BEING SENT:",
            productData.images
        );


        console.log(
            "PRODUCT DATA:",
            productData
        );


        // ==================================================
        // VALIDATION
        // ==================================================

        if (
            !productData.name
        ) {

            Swal.fire({

                icon: "warning",

                title:
                    "Product Name Required"

            });

            return;

        }


        if (
            !productData.image
        ) {

            Swal.fire({

                icon: "warning",

                title:
                    "Image URL Required",

                text:
                    "Please enter at least the main product image URL."

            });

            return;

        }


        // ==================================================
        // BUTTON DISABLE
        // ==================================================

        submitBtn.disabled =
            true;


        submitBtn.innerText =
            editId
                ?
            "Updating..."
                :
            "Adding...";


        // ==================================================
        // API URL
        // ==================================================

        const url =
            editId
                ?
            `${API}/${editId}`
                :
            API;


        const method =
            editId
                ?
            "PUT"
                :
            "POST";


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


            if (
                result.success === false
            ) {

                throw new Error(

                    result.message ||
                    "Product operation failed"

                );

            }


            // ==================================================
            // SUCCESS
            // ==================================================

            await Swal.fire({

                icon:
                    "success",

                title:
                    editId
                        ?
                    "Product Updated"
                        :
                    "Product Added",

                text:
                    editId
                        ?
                    "Product updated successfully."
                        :
                    "Product added successfully.",

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
            // RELOAD
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
                    ?
                "Update Product"
                    :
                "Add Product";

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
        // GET IMAGES
        // ==================================================

        let images = [];


        if (
            Array.isArray(
                product.images
            )
        ) {

            images =
                [
                    ...product.images
                ];

        }


        // Old image compatibility

        if (
            product.image &&
            !images.includes(
                product.image
            )
        ) {

            images.unshift(
                product.image
            );

        }


        // ==================================================
        // FILL IMAGE FIELDS
        // ==================================================

        if (imageInput) {

            imageInput.value =
                images[0] || "";

        }


        if (image2Input) {

            image2Input.value =
                images[1] || "";

        }


        if (image3Input) {

            image3Input.value =
                images[2] || "";

        }


        if (image4Input) {

            image4Input.value =
                images[3] || "";

        }


        if (image5Input) {

            image5Input.value =
                images[4] || "";

        }


        // ==================================================
        // PREVIEW
        // ==================================================

        updatePreview();


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


    if (
        !confirm.isConfirmed
    ) {

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


    if (preview) {

        preview.src =
            "";

        preview.style.display =
            "none";

    }


    if (previewPlaceholder) {

        previewPlaceholder.style.display =
            "flex";

    }


    if (image2Input) {
        image2Input.value = "";
    }

    if (image3Input) {
        image3Input.value = "";
    }

    if (image4Input) {
        image4Input.value = "";
    }

    if (image5Input) {
        image5Input.value = "";
    }

}


window.resetForm =
    resetForm;


// ======================================================
// CANCEL EDIT
// ======================================================

cancelEditBtn?.addEventListener(
    "click",
    resetForm
);


// ======================================================
// IMAGE PREVIEW
// ======================================================

function updatePreview() {

    const images =
        getProductImages();


    if (
        !images.length
    ) {

        if (preview) {

            preview.src =
                "";

            preview.style.display =
                "none";

        }


        if (previewPlaceholder) {

            previewPlaceholder.style.display =
                "flex";

        }


        return;

    }


    // Show first image as main preview

    if (preview) {

        preview.src =
            images[0];

        preview.style.display =
            "block";

    }


    if (previewPlaceholder) {

        previewPlaceholder.style.display =
            "none";

    }

}


// ======================================================
// IMAGE URL PREVIEW
// ======================================================

[
    imageInput,
    image2Input,
    image3Input,
    image4Input,
    image5Input
]
.forEach(
    input => {

        input?.addEventListener(
            "input",
            updatePreview
        );

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


        if (previewPlaceholder) {

            previewPlaceholder.style.display =
                "flex";

        }

    }
);


// ======================================================
// LOGOUT
// ======================================================

document
    .getElementById(
        "logoutBtn"
    )
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