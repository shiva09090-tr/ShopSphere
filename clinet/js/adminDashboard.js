const DASHBOARD_API =
    "https://shopsphere-sedh.onrender.com/api/dashboard-stats";


async function loadDashboard() {

    try {

        const res = await fetch(DASHBOARD_API);

        if (!res.ok) {
            throw new Error(`Dashboard API Error: ${res.status}`);
        }

        const result = await res.json();

        console.log("Dashboard API Response:", result);


        // --------------------------------------------------
        // SUPPORT BOTH:
        // { totalProducts: 4, totalOrders: 5 }
        //
        // AND:
        // { data: { totalProducts: 4, totalOrders: 5 } }
        // --------------------------------------------------

        const data = result.data || result;


        // --------------------------------------------------
        // GET VALUES
        // --------------------------------------------------

        const totalProducts =
            Number(data.totalProducts ?? 0);

        const totalOrders =
            Number(data.totalOrders ?? 0);

        const pendingOrders =
            Number(data.pendingOrders ?? 0);

        const deliveredOrders =
            Number(data.deliveredOrders ?? 0);

        const cancelledOrders =
            Number(data.cancelledOrders ?? 0);

        const revenue =
            Number(
                data.totalRevenue ??
                data.revenue ??
                0
            );


        // --------------------------------------------------
        // UPDATE DASHBOARD CARDS
        // --------------------------------------------------

        const productsEl =
            document.getElementById("products");

        const ordersEl =
            document.getElementById("orders");

        const pendingEl =
            document.getElementById("pending");

        const deliveredEl =
            document.getElementById("delivered");

        const cancelledEl =
            document.getElementById("cancelled");

        const revenueEl =
            document.getElementById("revenue");


        if (productsEl) {
            productsEl.textContent = totalProducts;
        }

        if (ordersEl) {
            ordersEl.textContent = totalOrders;
        }

        if (pendingEl) {
            pendingEl.textContent = pendingOrders;
        }

        if (deliveredEl) {
            deliveredEl.textContent = deliveredOrders;
        }

        if (cancelledEl) {
            cancelledEl.textContent = cancelledOrders;
        }

        if (revenueEl) {
            revenueEl.textContent =
                `₹${revenue.toLocaleString("en-IN")}`;
        }


        // --------------------------------------------------
        // NEW ORDERS NOTIFICATION
        // --------------------------------------------------

        const newOrdersEl =
            document.getElementById("newOrders");

        if (newOrdersEl) {
            newOrdersEl.textContent = pendingOrders;
        }


        // --------------------------------------------------
        // MONTHLY SALES CHART
        // --------------------------------------------------

       const ctx = document.getElementById("salesChart");

if (ctx && typeof Chart !== "undefined") {

    if (window.shopSphereChart) {
        window.shopSphereChart.destroy();
    }

    window.shopSphereChart = new Chart(ctx, {

        type: "bar",

        data: {

            labels: [
                "Products",
                "Orders",
                "Pending",
                "Delivered",
                "Cancelled"
            ],

            datasets: [{

                label: "ShopSphere",

                data: [
                    totalProducts,
                    totalOrders,
                    pendingOrders,
                    deliveredOrders,
                    cancelledOrders
                ]

            }]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            plugins: {

                legend: {
                    display: true
                }

            },

            scales: {

                y: {

                    beginAtZero: true,

                    ticks: {
                        precision: 0
                    }

                }

            }

        }

    });

}
    } catch (error) {

        console.error(
            "Dashboard loading error:",
            error
        );


        // Keep cards visible even if API fails
        document.getElementById("products").textContent = "0";
        document.getElementById("orders").textContent = "0";
        document.getElementById("pending").textContent = "0";
        document.getElementById("delivered").textContent = "0";
        document.getElementById("cancelled").textContent = "0";
        document.getElementById("revenue").textContent = "₹0";

    }

}


// --------------------------------------------------
// START DASHBOARD
// --------------------------------------------------

loadDashboard();
async function loadVisitorCount() {

    try {

        const response =
            await fetch(
                "https://shopsphere-sedh.onrender.com/api/visitors/stats"
            );


        const result =
            await response.json();


        console.log(
            "Visitor Stats:",
            result
        );


        if (result.success) {

            const element =
                document.getElementById(
                    "totalVisitors"
                );


            if (element) {

                element.textContent =
                    result.totalVisitors;

            }

        }

    } catch (error) {

        console.error(
            "Visitor Count Error:",
            error
        );

    }
}


loadVisitorCount();