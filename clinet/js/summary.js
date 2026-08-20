// ======================================================
// GET DATA FROM LOCAL STORAGE
// ======================================================

const customer =
    JSON.parse(localStorage.getItem("customer"));

const cart =
    JSON.parse(localStorage.getItem("cart")) || [];


// ======================================================
// ELEMENTS
// ======================================================

const customerDiv =
    document.getElementById("customerDetails");

const productDiv =
    document.getElementById("productList");

const totalDiv =
    document.getElementById("grandTotal");

const discountDiv =
    document.getElementById("discount");

const applyCouponBtn =
    document.getElementById("applyCoupon");

const confirmBtn =
    document.getElementById("confirmBtn");

const couponInput =
    document.getElementById("couponCode");


// ======================================================
// VARIABLES
// ======================================================

let total = 0;

let discount = 0;

let appliedCouponCode = "";

let finalTotal = 0;


// ======================================================
// CHECK CUSTOMER
// ======================================================

if (!customer) {

    if (typeof Swal !== "undefined") {

        Swal.fire({
            icon: "error",
            title: "Customer Details Missing",
            text: "Please enter your details first."
        }).then(() => {

            window.location.href =
                "checkout.html";

        });

    } else {

        alert(
            "Please enter your customer details first."
        );

        window.location.href =
            "checkout.html";
    }
}


// ======================================================
// SHOW CUSTOMER DETAILS
// ======================================================

if (customerDiv && customer) {

    customerDiv.innerHTML = `

        <div class="customer-info">

            <p>
                <strong>Name:</strong>
                ${customer.name || ""}
            </p>

            <p>
                <strong>Phone:</strong>
                ${customer.phone || ""}
            </p>

            <p>
                <strong>Email:</strong>
                ${customer.email || ""}
            </p>

            <p>
                <strong>Address:</strong>
                ${customer.address || ""}
            </p>

            <p>
                <strong>City:</strong>
                ${customer.city || ""}
            </p>

            <p>
                <strong>State:</strong>
                ${customer.state || ""}
            </p>

            <p>
                <strong>Pincode:</strong>
                ${customer.pincode || ""}
            </p>

        </div>

    `;
}


// ======================================================
// CHECK CART
// ======================================================

if (cart.length === 0) {

    if (productDiv) {

        productDiv.innerHTML = `

            <p style="
                color:#777;
                padding:15px 0;
            ">
                Your cart is empty.
            </p>

        `;

    }

}


// ======================================================
// SHOW PRODUCTS
// ======================================================

if (productDiv) {

    productDiv.innerHTML = "";

}


cart.forEach((item) => {

    const quantity =
        Number(item.quantity) || 1;

    const price =
        Number(item.price) || 0;

    const subtotal =
        price * quantity;

    total += subtotal;


    if (productDiv) {

        productDiv.innerHTML += `

            <div class="summary-product">

                <div class="product-info">

                    <strong>
                        ${item.name || "Product"}
                    </strong>

                    <p>
                        ₹${price} × ${quantity}
                    </p>

                </div>

                <strong>
                    ₹${subtotal}
                </strong>

            </div>

        `;

    }

});


// ======================================================
// INITIAL TOTAL
// ======================================================

finalTotal = total;


if (totalDiv) {

    totalDiv.innerText =
        `₹${finalTotal.toLocaleString("en-IN")}`;

}

if (discountDiv) {

    discountDiv.innerText = "0";

}


// ======================================================
// APPLY COUPON
// ======================================================

if (applyCouponBtn) {

    applyCouponBtn.addEventListener(
        "click",
        async () => {

            const code =
                couponInput
                    ? couponInput.value
                        .trim()
                        .toUpperCase()
                    : "";


            if (!code) {

                Swal.fire({

                    icon: "warning",

                    title: "Enter Coupon Code",

                    text:
                        "Please enter a coupon code."

                });

                return;

            }


            try {

                applyCouponBtn.disabled = true;

                applyCouponBtn.innerText =
                    "Checking...";


                const response =
                    await fetch(
                        "https://shopsphere-sedh.onrender.com/api/coupons/validate",
                        {

                            method: "POST",

                            headers: {

                                "Content-Type":
                                    "application/json"

                            },

                            body: JSON.stringify({

                                code: code,

                                orderTotal: total

                            })

                        }
                    );


                const result =
                    await response.json();


                console.log(
                    "Coupon API Response:",
                    result
                );


                if (!response.ok) {

                    throw new Error(

                        result.message ||
                        "Invalid coupon"

                    );

                }


                // ======================================
                // COUPON SUCCESS
                // ======================================

                discount =
                    Number(
                        result.data.discount
                    ) || 0;


                finalTotal =
                    Number(
                        result.data.finalTotal
                    );


                appliedCouponCode =
                    result.data.code ||
                    code;


                if (discountDiv) {

                    discountDiv.innerText =
                        discount.toFixed(0);

                }


                if (totalDiv) {

                    totalDiv.innerText =
                        `₹${finalTotal.toLocaleString("en-IN")}`;

                }


                Swal.fire({

                    icon: "success",

                    title: "Coupon Applied",

                    text:
                        `You saved ₹${discount.toFixed(0)}`,

                    timer: 1500,

                    showConfirmButton: false

                });

            }


            catch (error) {

                console.error(
                    "Coupon Error:",
                    error
                );


                discount = 0;

                finalTotal = total;

                appliedCouponCode = "";


                if (discountDiv) {

                    discountDiv.innerText =
                        "0";

                }


                if (totalDiv) {

                    totalDiv.innerText =
                        `₹${total.toLocaleString("en-IN")}`;

                }


                Swal.fire({

                    icon: "error",

                    title: "Invalid Coupon",

                    text:
                        error.message ||
                        "Unable to apply coupon."

                });

            }


            finally {

                applyCouponBtn.disabled =
                    false;

                applyCouponBtn.innerText =
                    "Apply Coupon";

            }

        }
    );

}


// ======================================================
// CONFIRM ORDER
// ======================================================

if (confirmBtn) {

    confirmBtn.addEventListener(
        "click",
        async () => {


            // ==========================================
            // CUSTOMER
            // ==========================================

            const currentCustomer =
                JSON.parse(
                    localStorage.getItem(
                        "customer"
                    )
                );


            // ==========================================
            // CART
            // ==========================================

            const currentCart =
                JSON.parse(
                    localStorage.getItem(
                        "cart"
                    )
                ) || [];


            // ==========================================
            // CUSTOMER CHECK
            // ==========================================

            if (!currentCustomer) {

                await Swal.fire({

                    icon: "error",

                    title:
                        "Customer Details Missing",

                    text:
                        "Please enter customer details first."

                });

                return;

            }


            // ==========================================
            // CART CHECK
            // ==========================================

            if (currentCart.length === 0) {

                await Swal.fire({

                    icon: "warning",

                    title: "Cart is Empty",

                    text:
                        "Please add products before placing an order."

                });

                return;

            }


            // ==========================================
            // LOGIN CHECK
            // ==========================================

            const user =
                JSON.parse(
                    localStorage.getItem("user")
                );


            console.log(
                "Logged in user:",
                user
            );


            // IMPORTANT:
            // Your login stores `id`, NOT `_id`

            if (!user || !user.id) {

                await Swal.fire({

                    icon: "warning",

                    title: "Login Required",

                    text:
                        "Please login before placing your order."

                });


                confirmBtn.disabled =
                    false;

                confirmBtn.innerText =
                    "Confirm Order";


                window.location.href =
                    "login.html";


                return;

            }


            // ==========================================
            // CORRECT USER ID
            // ==========================================

            const userId =
                user.id;


            console.log(
                "Correct User ID:",
                userId
            );


            // ==========================================
            // DISABLE BUTTON
            // ==========================================

            confirmBtn.disabled =
                true;

            confirmBtn.innerText =
                "Placing Order...";


            // ==========================================
            // CALCULATE SUBTOTAL
            // ==========================================

            let orderSubtotal = 0;


            currentCart.forEach(
                (item) => {

                    const quantity =
                        Number(
                            item.quantity
                        ) || 1;


                    const price =
                        Number(
                            item.price
                        ) || 0;


                    orderSubtotal +=
                        price * quantity;

                }
            );


            // ==========================================
            // FINAL TOTAL
            // ==========================================

            const orderFinalTotal =
                Math.max(
                    0,
                    orderSubtotal - discount
                );


            // ==========================================
            // CREATE ORDER
            // ==========================================

            const order = {

                // IMPORTANT
                // Use user.id here

                userId: userId,


                customerName:
                    currentCustomer.name ||
                    "",


                phone:
                    currentCustomer.phone ||
                    "",


                email:
                    currentCustomer.email ||
                    "",


                address:
                    currentCustomer.address ||
                    "",


                city:
                    currentCustomer.city ||
                    "",


                state:
                    currentCustomer.state ||
                    "",


                pincode:
                    currentCustomer.pincode ||
                    "",


                items:

                    currentCart.map(
                        (item) => ({

                            productId:
                                item._id ||
                                item.id ||
                                "",


                            productName:
                                item.name ||
                                "Product",


                            price:
                                Number(
                                    item.price
                                ) || 0,


                            quantity:
                                Number(
                                    item.quantity
                                ) || 1,


                            image:
                                item.image ||
                                ""

                        })
                    ),


                totalPrice:
                    orderFinalTotal,


                couponCode:
                    appliedCouponCode ||
                    ""

            };


            console.log(
                "Order being sent:",
                order
            );


            // ==========================================
            // SAVE ORDER
            // ==========================================

            try {

                const response =
                    await fetch(
                        "https://shopsphere-sedh.onrender.com/api/orders",
                        {

                            method: "POST",

                            headers: {

                                "Content-Type":
                                    "application/json"

                            },

                            body:
                                JSON.stringify(
                                    order
                                )

                        }
                    );


                const result =
                    await response.json();


                console.log(
                    "Order API Response:",
                    result
                );


                if (!response.ok) {

                    throw new Error(

                        result.message ||
                        "Order could not be placed."

                    );

                }


                // ======================================
                // SERVER ORDER
                // ======================================

                const savedOrder =
                    result.data ||
                    {};


                const savedDiscount =
                    Number(
                        savedOrder.discount
                    ) || discount;


                const savedTotal =
                    Number(
                        savedOrder.totalPrice
                    ) || orderFinalTotal;


                // ======================================
                // WHATSAPP MESSAGE
                // ======================================

                let message =
                    `🛍️ *New Order - ShopSphere*\n\n`;


                message +=
                    `👤 *Customer Details*\n`;


                message +=
                    `Name : ${currentCustomer.name || ""}\n`;


                message +=
                    `Phone : ${currentCustomer.phone || ""}\n`;


                message +=
                    `Email : ${currentCustomer.email || ""}\n`;


                message +=
                    `Address : ${currentCustomer.address || ""}\n`;


                message +=
                    `City : ${currentCustomer.city || ""}\n`;


                message +=
                    `State : ${currentCustomer.state || ""}\n`;


                message +=
                    `Pincode : ${currentCustomer.pincode || ""}\n\n`;


                message +=
                    `📦 *Products*\n\n`;


                currentCart.forEach(
                    (item, index) => {

                        const quantity =
                            Number(
                                item.quantity
                            ) || 1;


                        const price =
                            Number(
                                item.price
                            ) || 0;


                        const subtotal =
                            price * quantity;


                        message +=
                            `${index + 1}. ${item.name || "Product"}\n`;


                        message +=
                            `Qty : ${quantity}\n`;


                        message +=
                            `Price : ₹${price}\n`;


                        message +=
                            `Subtotal : ₹${subtotal}\n\n`;

                    }
                );


                message +=
                    `🎁 Discount : ₹${savedDiscount}\n`;


                if (savedOrder.couponCode) {

                    message +=
                        `🎟️ Coupon : ${savedOrder.couponCode}\n`;

                }


                message +=
                    `💰 *Grand Total : ₹${savedTotal}*`;


                // ======================================
                // WHATSAPP
                // ======================================

                const whatsappPhone =
                    "919026133685";


                const whatsappURL =
                    `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(message)}`;


                console.log(
                    "WhatsApp URL:",
                    whatsappURL
                );


                window.open(
                    whatsappURL,
                    "_blank"
                );


                // ======================================
                // CLEAR CART
                // ======================================

                localStorage.removeItem(
                    "cart"
                );


                // ======================================
                // SUCCESS
                // ======================================

                await Swal.fire({

                    icon: "success",

                    title:
                        "Order Placed!",

                    text:
                        "Your order has been placed successfully.",

                    timer: 1500,

                    showConfirmButton: false

                });


                // ======================================
                // THANK YOU
                // ======================================

                window.location.href =
                    "thankyou.html";

            }


            catch (error) {

                console.error(
                    "❌ Order Error:",
                    error
                );


                confirmBtn.disabled =
                    false;


                confirmBtn.innerText =
                    "Confirm Order";


                Swal.fire({

                    icon: "error",

                    title:
                        "Order Failed",

                    text:
                        error.message ||
                        "Unable to place order."

                });

            }

        }
    );

}