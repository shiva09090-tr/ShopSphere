const DASHBOARD_API = "https://shopsphere-sedh.onrender.com/api/dashboard-stats";

async function loadDashboard(){

    const res = await fetch(DASHBOARD_API);

    const data = await res.json();

    const ctx = document.getElementById("salesChart");

    new Chart(ctx,{

        type:"bar",

        data:{

            labels:[
                "Products",
                "Orders",
                "Pending",
                "Delivered",
                "Cancelled"
            ],

            datasets:[{

                label:"ShopSphere",

                data:[

                    data.totalProducts,
                    data.totalOrders,
                    data.pendingOrders,
                    data.deliveredOrders,
                    data.cancelledOrders

                ]

            }]

        }

    });

}

loadDashboard();