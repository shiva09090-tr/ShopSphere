const user = JSON.parse(localStorage.getItem("user"));

const container = document.getElementById("ordersContainer");

async function loadOrders(){

    const res = await fetch(`http://localhost:5000/api/admin/user/${user._id}`);

    const result = await res.json();

    const orders = result.data;

    container.innerHTML="";

    orders.forEach(order=>{

        let products="";

        order.items.forEach(item=>{

            products +=`

            <div class="product">

                <span>${item.productName}</span>

                <span>${item.quantity} × ₹${item.price}</span>

            </div>

            `;

        });

        container.innerHTML +=`

        <div class="orderCard">

            <div class="orderHeader">

                <h3>Order #${order._id.slice(-6)}</h3>

                <span class="status ${order.status.toLowerCase()}">

                ${order.status}

                </span>

            </div>

            <p>Date :

            ${new Date(order.createdAt).toLocaleDateString()}

            </p>

            ${products}

            <h3>Total : ₹${order.totalPrice}</h3>

            <button onclick="viewOrder('${order._id}')">

            View Details

            </button>

            ${order.status==="Pending"

            ?

            `<button onclick="cancelOrder('${order._id}')">

            Cancel Order

            </button>`

            :

            ""

            }

        </div>

        `;

    });

}

loadOrders();
function viewOrder(id){

    localStorage.setItem("orderId",id);

    window.location.href="orderDetails.html";

}
async function cancelOrder(id){

    const ok = confirm("Cancel this order?");

    if(!ok) return;

    await fetch(

    `http://localhost:5000/api/admin/cancel/${id}`,

    {

        method:"PUT"

    });

    loadOrders();

}