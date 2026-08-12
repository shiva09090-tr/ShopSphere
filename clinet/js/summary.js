const customer = JSON.parse(localStorage.getItem("customer"));
const cart = JSON.parse(localStorage.getItem("cart")) || [];

const customerDiv = document.getElementById("customerDetails");
const productDiv = document.getElementById("productList");
const totalDiv = document.getElementById("grandTotal");
const discountDiv = document.getElementById("discount");

const applyCouponBtn = document.getElementById("applyCoupon");
const confirmBtn = document.getElementById("confirmBtn");
const couponInput = document.getElementById("couponCode");

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
            window.location.href = "checkout.html";
        });

    } else {

        alert("Please enter your customer details first.");
        window.location.href = "checkout.html";

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
            <p class="empty-cart">
                Your cart is empty.
            </p>
        `;

    }

    if (totalDiv) {
        totalDiv.innerText = "₹0";
    }

} else {


    // ==================================================
    // SHOW PRODUCTS
    // ==================================================

    if (productDiv) {

        productDiv.innerHTML = "";

    }


    cart.forEach((product) => {

        const quantity =
            Number(product.quantity) || 1;

        const price =
            Number(product.price) || 0;

        const subtotal =
            price * quantity;

        total += subtotal;


        if (productDiv) {

            productDiv.innerHTML += `
                <div class="summary-product">

                    <div class="summary-product-info">

                        <strong>
                            ${product.name || "Product"}
                        </strong>

                        <p>
                            ₹${price.toLocaleString("en-IN")}
                            × ${quantity}
                        </p>

                    </div>

                    <strong>
                        ₹${subtotal.toLocaleString("en-IN")}
                    </strong>

                </div>
            `;

        }

    });

}


// ======================================================
// INITIAL TOTAL
// ======================================================

finalTotal = total - discount;

if (totalDiv) {

    totalDiv.innerText =
        `₹${finalTotal.toLocaleString("en-IN")}`;

}

if (discountDiv) {

    discountDiv.innerText =
        discount.toFixed(0);

}


// ======================================================
// APPLY COUPON
// ======================================================

if (applyCouponBtn) {

    applyCouponBtn.addEventListener("click", async () => {

        const code =
            couponInput
                ? couponInput.value.trim().toUpperCase()
                : "";


        if (!code) {

            Swal.fire({
                icon: "warning",
                title: "Enter Coupon Code",
                text: "Please enter a coupon code."
            });

            return;

        }


        try {

            applyCouponBtn.disabled = true;
            applyCouponBtn.innerText = "Checking...";


            const response = await fetch(
                "https://shopsphere-sedh.onrender.com/api/coupons/validate",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        code: code,
                        orderTotal: total
                    })
                }
            );


            const result =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    result.message ||
                    "Invalid coupon"
                );

            }


            // ------------------------------------------
            // COUPON SUCCESS
            // ------------------------------------------

            discount =
                Number(result.data.discount) || 0;


            finalTotal =
                Number(result.data.finalTotal);


            appliedCouponCode =
                result.data.code || code;


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

                discountDiv.innerText = "0";

            }


            if (totalDiv) {

                totalDiv.innerText =
                    `₹${total.toLocaleString("en-IN")}`;

            }


            Swal.fire({

                icon: "error",

                title: "Coupon Not Applied",

                text:
                    error.message ||
                    "Invalid coupon"

            });

        }


        finally {

            applyCouponBtn.disabled = false;

            applyCouponBtn.innerText =
                "Apply Coupon";

        }

    });

}


// ======================================================
// CONFIRM ORDER
// ======================================================

if (confirmBtn) {

    confirmBtn.addEventListener("click", async () => {


        // ----------------------------------------------
        // CUSTOMER
        // ----------------------------------------------

        const currentCustomer =
            JSON.parse(
                localStorage.getItem("customer")
            );


        // ----------------------------------------------
        // CART
        // ----------------------------------------------

        const currentCart =
            JSON.parse(
                localStorage.getItem("cart")
            ) || [];


        if (!currentCustomer) {

            Swal.fire({

                icon: "error",

                title:
                    "Customer Details Missing",

                text:
                    "Please enter customer details first."

            });

            return;

        }


        if (currentCart.length === 0) {

            Swal.fire({

                icon: "warning",

                title: "Cart is Empty",

                text:
                    "Please add products before placing an order."

            });

            return;

        }


        // ----------------------------------------------
        // DISABLE BUTTON
        // ----------------------------------------------

        confirmBtn.disabled = true;

        confirmBtn.innerText =
            "Placing Order...";


        // ----------------------------------------------
        // CALCULATE SUBTOTAL
        // ----------------------------------------------

        let orderSubtotal = 0;


        currentCart.forEach((item) => {

            const quantity =
                Number(item.quantity) || 1;

            const price =
                Number(item.price) || 0;

            orderSubtotal +=
                price * quantity;

        });


        // ----------------------------------------------
        // FINAL TOTAL
        // ----------------------------------------------

        const orderFinalTotal =
            orderSubtotal - discount;


        // ----------------------------------------------
        // USER
        // ----------------------------------------------

        const user =
            JSON.parse(
                localStorage.getItem("user")
            );


        // ----------------------------------------------
        // CREATE ORDER OBJECT
        // ----------------------------------------------

        const order = {

            userId:
                user ? user._id : "",

            customerName:
                currentCustomer.name || "",

            phone:
                currentCustomer.phone || "",

            email:
                currentCustomer.email || "",

            address:
                currentCustomer.address || "",

            city:
                currentCustomer.city || "",

            state:
                currentCustomer.state || "",

            pincode:
                currentCustomer.pincode || "",


            items:
                currentCart.map((item) => ({

                    productId:
                        item._id,

                    productName:
                        item.name,

                    price:
                        Number(item.price) || 0,

                    quantity:
                        Number(item.quantity) || 1,

                    image:
                        item.image || ""

                })),


            totalPrice:
                orderFinalTotal,


            couponCode:
                appliedCouponCode || ""

        };


        console.log(
            "Sending Order:",
            order
        );


        // ==================================================
        // SAVE ORDER
        // ==================================================

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
                            JSON.stringify(order)

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


            // ------------------------------------------
            // USE SERVER TOTAL
            // ------------------------------------------

            const savedOrder =
                result.data;


            const savedDiscount =
                Number(savedOrder.discount) || 0;


            const savedTotal =
                Number(savedOrder.totalPrice) || 0;


            // ==================================================
            // WHATSAPP MESSAGE
            // ==================================================

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


            currentCart.forEach((item, index) => {

                const quantity =
                    Number(item.quantity) || 1;

                const price =
                    Number(item.price) || 0;

                const subtotal =
                    price * quantity;


                message +=
                    `${index + 1}. ${item.name}\n`;

                message +=
                    `Qty : ${quantity}\n`;

                message +=
                    `Price : ₹${price}\n`;

                message +=
                    `Subtotal : ₹${subtotal}\n\n`;

            });


            message +=
                `🎁 Discount : ₹${savedDiscount}\n`;


            if (savedOrder.couponCode) {

                message +=
                    `🎟️ Coupon : ${savedOrder.couponCode}\n`;

            }


            message +=
                `💰 *Grand Total : ₹${savedTotal}*`;


            // ==================================================
            // WHATSAPP
            // ==================================================

            const whatsappPhone =
                "919026133685";


            const whatsappURL =
                `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(message)}`;


            console.log(
                "WhatsApp URL:",
                whatsappURL
            );


            // Open WhatsApp
            window.open(
                whatsappURL,
                "_blank"
            );


            // ==================================================
            // CLEAR CART
            // ==================================================

            localStorage.removeItem("cart");


            // ==================================================
            // SUCCESS
            // ==================================================

            Swal.fire({

                icon: "success",

                title: "Order Placed!",

                text:
                    "Your order has been placed successfully.",

                timer: 1500,

                showConfirmButton: false

            });


            // ==================================================
            // THANK YOU
            // ==================================================

            setTimeout(() => {

                window.location.href =
                    "thankyou.html";

            }, 1500);

        }


        catch (error) {

            console.error(
                "❌ Order Error:",
                error
            );


            confirmBtn.disabled = false;

            confirmBtn.innerText =
                "Confirm Order";


            Swal.fire({

                icon: "error",

                title: "Order Failed",

                text:
                    error.message ||
                    "Unable to place order."

            });

        }

    });

}