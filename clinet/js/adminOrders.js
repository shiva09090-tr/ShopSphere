const API = "http://localhost:5000/api/admin/orders";

const container = document.getElementById("ordersContainer");
const search = document.getElementById("search");
const statusFilter = document.getElementById("statusFilter");

async function loadOrders() {

    try {

        const response = await fetch(API);
        const result = await response.json();

        // Dashboard Stats
        document.getElementById("totalOrders").innerText = result.data.length;

        const pending = result.data.filter(order => order.status === "Pending").length;
        const delivered = result.data.filter(order => order.status === "Delivered").length;

        const revenue = result.data
            .filter(order => order.status === "Delivered")
            .reduce((sum, order) => sum + order.totalPrice, 0);

        document.getElementById("pendingOrders").innerText = pending;
        document.getElementById("deliveredOrders").innerText = delivered;
        document.getElementById("revenue").innerText = "₹" + revenue;

        container.innerHTML = "";

        const keyword = search.value.toLowerCase();
        const selectedStatus = statusFilter.value;

        const filtered = result.data.filter(order => {

            const matchSearch =
                order.customerName.toLowerCase().includes(keyword) ||
                order.phone.includes(keyword);

            const matchStatus =
                selectedStatus === "All" ||
                order.status === selectedStatus;

            return matchSearch && matchStatus;

        });

        filtered.forEach(order => {

            let products = "";

            order.items.forEach(item => {

                products += `
                <div class="item">
                    <p>
                        <b>${item.productName}</b>
                        × ${item.quantity}
                        - ₹${item.price}
                    </p>
                </div>
                `;

            });

            container.innerHTML += `

            <div class="order-card">

                <h2>${order.customerName}</h2>

                <p><b>Phone :</b> ${order.phone}</p>

                <p><b>Email :</b> ${order.email}</p>

                <p><b>Address :</b> ${order.address}</p>

                <p><b>Total :</b> ₹${order.totalPrice}</p>

                <p>
                    <b>Status :</b>

                    <span class="${order.status.toLowerCase()}">
                        ${order.status}
                    </span>

                </p>

                <h3>Products</h3>

                ${products}

                <button onclick="viewOrder('${order._id}')">
                    View Details
                </button>

                <select onchange="changeStatus('${order._id}',this.value)">

                    <option ${order.status==="Pending"?"selected":""}>Pending</option>

                    <option ${order.status==="Confirmed"?"selected":""}>Confirmed</option>

                    <option ${order.status==="Packed"?"selected":""}>Packed</option>

                    <option ${order.status==="Shipped"?"selected":""}>Shipped</option>

                    <option ${order.status==="Delivered"?"selected":""}>Delivered</option>

                    <option ${order.status==="Cancelled"?"selected":""}>Cancelled</option>

                </select>

                <button
                style="background:red;color:white"
                onclick="deleteOrder('${order._id}')">

                    Delete Order

                </button>

            </div>

            `;

        });

    } catch (err) {

        console.log(err);

    }

}

loadOrders();

function viewOrder(id) {

    localStorage.setItem("selectedOrder", id);

    window.location.href = "orderDetails.html";

}

async function deleteOrder(id) {

   const result = await Swal.fire({
    title:"Delete Order?",
    text:"This action cannot be undone.",
    icon:"warning",
    showCancelButton:true,
    confirmButtonText:"Delete"
});

if(!result.isConfirmed){
    return;
}
    await fetch(API + "/" + id, {

        method: "DELETE"

    });

    loadOrders();

}

async function changeStatus(id, status) {

    await fetch(API + "/" + id, {

        method: "PUT",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify({

            status

        })

    });

    loadOrders();

}

search.addEventListener("keyup", loadOrders);
statusFilter.addEventListener("change", loadOrders);
document
.getElementById("exportBtn")
.addEventListener("click",()=>{

    window.open(

        "http://localhost:5000/api/admin/export",

        "_blank"

    );

});