const API =
    "https://shopsphere-sedh.onrender.com/api/admin/orders";

const container =
    document.getElementById("ordersContainer");

const search =
    document.getElementById("search");

const statusFilter =
    document.getElementById("statusFilter");


// =====================================================
// LOAD ORDERS
// =====================================================

async function loadOrders() {

    try {

        const response =
            await fetch(API);

        const result =
            await response.json();

        if (!result.success) {

            throw new Error(
                result.message ||
                "Unable to load orders"
            );

        }


        const orders =
            result.data || [];


        // =================================================
        // DASHBOARD STATS
        // =================================================

        document.getElementById(
            "totalOrders"
        ).innerText =
            orders.length;


        const pending =
            orders.filter(
                order =>
                    order.status === "Pending"
            ).length;


        const delivered =
            orders.filter(
                order =>
                    order.status === "Delivered"
            ).length;


        const revenue =
            orders
                .filter(
                    order =>
                        order.status === "Delivered"
                )
                .reduce(
                    (sum, order) =>
                        sum +
                        Number(order.totalPrice || 0),
                    0
                );


        document.getElementById(
            "pendingOrders"
        ).innerText =
            pending;


        document.getElementById(
            "deliveredOrders"
        ).innerText =
            delivered;


        document.getElementById(
            "revenue"
        ).innerText =
            "₹" + revenue;


        // =================================================
        // CLEAR CONTAINER
        // =================================================

        container.innerHTML = "";


        // =================================================
        // SEARCH + FILTER
        // =================================================

        const keyword =
            search.value
                .toLowerCase()
                .trim();


        const selectedStatus =
            statusFilter.value;


        const filtered =
            orders.filter(order => {

                const customerName =
                    String(
                        order.customerName || ""
                    ).toLowerCase();


                const phone =
                    String(
                        order.phone || ""
                    );


                const matchSearch =
                    customerName.includes(
                        keyword
                    ) ||
                    phone.includes(
                        keyword
                    );


                const matchStatus =
                    selectedStatus === "All" ||
                    order.status ===
                        selectedStatus;


                return (
                    matchSearch &&
                    matchStatus
                );

            });


        // =================================================
        // NO ORDERS
        // =================================================

        if (
            filtered.length === 0
        ) {

            container.innerHTML = `

                <div
                    style="
                        text-align:center;
                        padding:40px;
                        color:#777;
                    "
                >

                    <h2>
                        📦 No Orders Found
                    </h2>

                    <p>
                        No order matches your search/filter.
                    </p>

                </div>

            `;

            return;

        }


        // =================================================
        // DISPLAY ORDERS
        // =================================================

        filtered.forEach(order => {


            let products = "";


            (order.items || []).forEach(
                item => {

                    products += `

                        <div class="item">

                            <p>

                                <b>
                                    ${item.productName || "Product"}
                                </b>

                                ×
                                ${item.quantity || 1}

                                -
                                ₹${item.price || 0}

                            </p>

                        </div>

                    `;

                }
            );


            // =================================================
            // STATUS CLASS
            // =================================================

            const statusClass =
                String(
                    order.status || "Pending"
                )
                .toLowerCase()
                .replace(
                    /\s+/g,
                    "-"
                );


            // =================================================
            // ORDER CARD
            // =================================================

            container.innerHTML += `

                <div class="order-card">

                    <h2>
                        ${order.customerName || "Customer"}
                    </h2>


                    <p>
                        <b>Order ID :</b>
                        <small>
                            ${order._id}
                        </small>
                    </p>


                    <p>
                        <b>Phone :</b>
                        ${order.phone || "—"}
                    </p>


                    <p>
                        <b>Email :</b>
                        ${order.email || "—"}
                    </p>


                    <p>
                        <b>Address :</b>
                        ${order.address || "—"}
                    </p>


                    <p>
                        <b>Total :</b>
                        ₹${order.totalPrice || 0}
                    </p>


                    <p>

                        <b>Status :</b>

                        <span
                            class="${statusClass}"
                        >
                            ${order.status || "Pending"}
                        </span>

                    </p>


                    <h3>
                        Products
                    </h3>


                    ${products}


                    <!-- VIEW DETAILS -->

                    <button
                        onclick="viewOrder('${order._id}')"
                    >
                        View Details
                    </button>


                    <!-- STATUS UPDATE -->

                    <select
                        onchange="
                            changeStatus(
                                '${order._id}',
                                this.value
                            )
                        "
                    >

                       <option ${order.status==="Pending"?"selected":""}>Pending</option>

<option ${order.status==="Confirmed"?"selected":""}>Confirmed</option>

<option ${order.status==="Packed"?"selected":""}>Packed</option>

<option ${order.status==="Shipped"?"selected":""}>Shipped</option>

<option ${order.status==="Out for Delivery"?"selected":""}>Out for Delivery</option>

<option ${order.status==="Delivered"?"selected":""}>Delivered</option>

<option ${order.status==="Cancelled"?"selected":""}>Cancelled</option>

                    </select>
                    <div class="delivery-date-box">

    <label>
        📅 Expected Delivery Date
    </label>

    <input
        type="date"
        value="${
            order.deliveryDate
            ? new Date(
                order.deliveryDate
            )
                .toISOString()
                .split("T")[0]
            : ""
        }"
        onchange="
            changeDeliveryDate(
                '${order._id}',
                this.value
            )
        "
    >

</div>

                    <!-- DELETE -->

                    <button
                        style="
                            background:red;
                            color:white;
                            margin-top:10px;
                        "
                        onclick="
                            deleteOrder(
                                '${order._id}'
                            )
                        "
                    >
                        Delete Order
                    </button>


                </div>

            `;

        });


    }

    catch (err) {

        console.error(
            "Load Orders Error:",
            err
        );


        container.innerHTML = `

            <div
                style="
                    text-align:center;
                    padding:40px;
                    color:red;
                "
            >

                Unable to load orders.

            </div>

        `;

    }

}


// =====================================================
// VIEW ORDER
// =====================================================

function viewOrder(id) {

    localStorage.setItem(
        "selectedOrder",
        id
    );


    window.location.href =
        "orderDetails.html";

}


// =====================================================
// DELETE ORDER
// =====================================================

async function deleteOrder(id) {

    const result =
        await Swal.fire({

            title:
                "Delete Order?",

            text:
                "This action cannot be undone.",

            icon:
                "warning",

            showCancelButton:
                true,

            confirmButtonText:
                "Delete",

            cancelButtonText:
                "Cancel"

        });


    if (!result.isConfirmed) {

        return;

    }


    try {

        const response =
            await fetch(
                API + "/" + id,
                {
                    method: "DELETE"
                }
            );


        const result =
            await response.json();


        if (!response.ok) {

            throw new Error(
                result.message ||
                "Unable to delete order"
            );

        }


        await Swal.fire({

            icon:
                "success",

            title:
                "Order Deleted",

            timer:
                1200,

            showConfirmButton:
                false

        });


        loadOrders();

    }

    catch (error) {

        console.error(
            "Delete Order Error:",
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


// =====================================================
// CHANGE ORDER STATUS
// =====================================================

async function changeStatus(
    id,
    status
) {

    try {

        const response =
            await fetch(
                API + "/" + id,
                {

                    method:
                        "PUT",

                    headers:
                        {
                            "Content-Type":
                                "application/json"
                        },

                    body:
                        JSON.stringify({
                            status: status
                        })

                }
            );


        const result =
            await response.json();


        if (!response.ok) {

            throw new Error(
                result.message ||
                "Unable to update order status"
            );

        }


        console.log(
            "Order Status Updated:",
            result
        );


        await Swal.fire({

            icon:
                "success",

            title:
                "Status Updated",

            text:
                `Order is now "${status}"`,

            timer:
                1000,

            showConfirmButton:
                false

        });


        // Reload admin orders

        loadOrders();

    }

    catch (error) {

        console.error(
            "Status Update Error:",
            error
        );


        Swal.fire({

            icon:
                "error",

            title:
                "Update Failed",

            text:
                error.message

        });


        // Reload original value

        loadOrders();

    }

}


// =====================================================
// SEARCH
// =====================================================

search.addEventListener(
    "keyup",
    loadOrders
);


// =====================================================
// STATUS FILTER
// =====================================================

statusFilter.addEventListener(
    "change",
    loadOrders
);


// =====================================================
// EXPORT EXCEL
// =====================================================

document
    .getElementById("exportBtn")
    .addEventListener(
        "click",
        () => {

            window.open(

                "https://shopsphere-sedh.onrender.com/api/admin/export",

                "_blank"

            );

        }
    );

async function changeDeliveryDate(
    id,
    deliveryDate
) {

    if (!deliveryDate) {
        return;
    }

    try {

        const response =
            await fetch(
                `${API}/${id}/delivery-date`,
                {

                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        deliveryDate:
                            deliveryDate
                    })

                }
            );


        const result =
            await response.json();


        console.log(
            "Delivery Date Response:",
            result
        );


        if (
            !response.ok ||
            !result.success
        ) {

            throw new Error(
                result.message ||
                "Unable to update delivery date"
            );

        }


        await Swal.fire({

            icon: "success",

            title: "Updated!",

            text:
                "Delivery date updated successfully.",

            timer: 1500,

            showConfirmButton: false

        });


        loadOrders();

    } catch (error) {

        console.error(
            "Delivery Date Error:",
            error
        );


        Swal.fire({

            icon: "error",

            title: "Error",

            text: error.message

        });

    }

}
// =====================================================
// START
// =====================================================

loadOrders();