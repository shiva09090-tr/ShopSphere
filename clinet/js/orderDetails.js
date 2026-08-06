const id = localStorage.getItem("selectedOrder");

const API = "http://localhost:5000/api/admin/orders";

async function loadOrder(){

const response = await fetch(API);

const result = await response.json();

const order = result.data.find(o=>o._id===id);

const div=document.getElementById("order");

let products="";

order.items.forEach(item=>{

products += `

<p>

${item.productName}

×

${item.quantity}

-

₹${item.price}

</p>

`;

});

div.innerHTML=`

<h2>${order.customerName}</h2>

<p>

Phone :

${order.phone}

</p>

<p>

Email :

${order.email}

</p>

<p>

Address :

${order.address}

</p>

<hr>

<h3>

Products

</h3>

${products}

<hr>

<h2>

Grand Total

₹${order.totalPrice}

</h2>

<p>

Status :

${order.status}

</p>

`;

}
const timeline = document.getElementById("timeline");

let html="";

const steps=[

"Pending",

"Confirmed",

"Packed",

"Shipped",

"Delivered"

];

steps.forEach(step=>{

html += `

<p>

${step===order.status ? "🟢" : "⚪"}

${step}

</p>

`;

});

timeline.innerHTML=html;
loadOrder();