const customer = JSON.parse(localStorage.getItem("customer"));

const cart = JSON.parse(localStorage.getItem("cart")) || [];

const customerDiv = document.getElementById("customerDetails");

const productDiv = document.getElementById("productList");

const totalDiv = document.getElementById("grandTotal");
let discount = 0;

let total = 0;

customerDiv.innerHTML = `

<h3>Customer Details</h3>

<p><b>Name :</b> ${customer.name}</p>

<p><b>Phone :</b> ${customer.phone}</p>

<p><b>Email :</b> ${customer.email}</p>

<p><b>Address :</b> ${customer.address}</p>

<p><b>City :</b> ${customer.city}</p>

<p><b>State :</b> ${customer.state}</p>

<p><b>Pincode :</b> ${customer.pincode}</p>

`;

productDiv.innerHTML = "";

cart.forEach(product=>{

let quantity = product.quantity || 1;

let price = product.price * quantity;

total += price;

productDiv.innerHTML += `

<div class="product">

<div>

<h3>${product.name}</h3>

<p>

₹${product.price}

× ${quantity}

</p>

</div>

<div>

₹${price}

</div>

</div>

`;

});

totalDiv.innerHTML = finalTotal;
document.getElementById("grandTotal").innerText = total;
document.getElementById("confirmBtn").addEventListener("click", async () => {

    const customer = JSON.parse(localStorage.getItem("customer"));
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    let total = 0;

    let message = `🛍️ *New Order - ShopSphere*%0A%0A`;

    message += `👤 *Customer Details*%0A`;
    message += `Name : ${customer.name}%0A`;
    message += `Phone : ${customer.phone}%0A`;
    message += `Email : ${customer.email}%0A`;
    message += `Address : ${customer.address}%0A`;
    message += `City : ${customer.city}%0A`;
    message += `State : ${customer.state}%0A`;
    message += `Pincode : ${customer.pincode}%0A%0A`;

    message += `📦 *Products*%0A%0A`;

    cart.forEach((item, index) => {

        let qty = item.quantity || 1;

        let price = item.price * qty;

        total += price;

        message += `${index + 1}. ${item.name}%0A`;
        message += `Qty : ${qty}%0A`;
        message += `Price : ₹${item.price}%0A`;
        message += `Subtotal : ₹${price}%0A%0A`;

    });

    const finalTotal = total-discount;

message += `🎁 Discount : ₹${discount}%0A`;

message += `💰 Grand Total : ₹${finalTotal}`;
    
    // Save Order in Database

const user = JSON.parse(localStorage.getItem("user"));

const order = {

    userId: user ? user._id : "",

    customerName: customer.name,

    phone: customer.phone,

    email: customer.email,

    address: customer.address,

    city: customer.city,

    state: customer.state,

    pincode: customer.pincode,

    items: cart.map(item => ({

        productId: item._id,

        productName: item.name,

        price: item.price,

        quantity: item.quantity || 1,

        image: item.image

    })),

    totalPrice: finalTotal

};

try {

    await fetch("http://localhost:5000/api/orders", {

        method: "POST",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify(order)

    });

    console.log("Order Saved");

} catch (err) {

    console.log(err);

}

    // 👇 Apna WhatsApp Number
    const phone = "916391431479";

    window.open(
        `https://wa.me/${phone}?text=${message}`,
        "_blank"
    );

    setTimeout(() => {

        window.location.href = "thankyou.html";

    },1500);

});
document.getElementById("applyCoupon").addEventListener("click",()=>{

    const code =
    document.getElementById("couponCode")
    .value
    .trim()
    .toUpperCase();

    discount=0;

    if(code==="WELCOME10"){

        discount = total*0.10;

    }

    else if(code==="SAVE20"){

        discount = total*0.20;

    }

    else if(code==="SHOP100"){

        discount = 100;

    }

    else{

        Swal.fire({

            icon:"error",

            title:"Invalid Coupon"

        });

        return;

    }

    document.getElementById("discount")
    .innerText = discount.toFixed(0);

    document.getElementById("grandTotal")
    .innerText = (total-discount).toFixed(0);

    Swal.fire({

        icon:"success",

        title:"Coupon Applied"

    });

});