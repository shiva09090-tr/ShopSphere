const API =
    "https://shopsphere-sedh.onrender.com/api/visitors";


// ==========================================
// LOAD STATS
// ==========================================

async function loadStats() {

    try {

        const response =
            await fetch(
                `${API}/stats`
            );


        const result =
            await response.json();


        console.log(
            "Visitor Stats:",
            result
        );


        if (!result.success) {

            throw new Error(
                result.message ||
                "Unable to load visitor stats"
            );

        }


        document.getElementById(
            "totalVisitors"
        ).textContent =
            result.totalVisitors;


        document.getElementById(
            "todayVisitors"
        ).textContent =
            result.todayVisitors;


        document.getElementById(
            "last7Days"
        ).textContent =
            result.last7Days;


        document.getElementById(
            "last30Days"
        ).textContent =
            result.last30Days;


    } catch (error) {

        console.error(
            "Stats Error:",
            error
        );

    }

}


// ==========================================
// LOAD RECENT VISITORS
// ==========================================

async function loadVisitors() {

    try {

        const response =
            await fetch(
                `${API}/recent`
            );


        const result =
            await response.json();


        if (!result.success) {

            throw new Error(
                result.message ||
                "Unable to load visitors"
            );

        }


        const tbody =
            document.getElementById(
                "visitorTableBody"
            );


        tbody.innerHTML = "";


        result.data.forEach(
            (visitor, index) => {

                const firstVisit =
                    new Date(
                        visitor.firstVisit
                    ).toLocaleString(
                        "en-IN"
                    );


                const lastVisit =
                    new Date(
                        visitor.lastVisit
                    ).toLocaleString(
                        "en-IN"
                    );


                tbody.innerHTML += `

                    <tr>

                        <td>
                            ${index + 1}
                        </td>

                        <td>
                            ${visitor.visitorId}
                        </td>

                        <td>
                            ${firstVisit}
                        </td>

                        <td>
                            ${lastVisit}
                        </td>

                    </tr>

                `;

            }
        );


    } catch (error) {

        console.error(
            "Visitors Error:",
            error
        );

    }

}


// ==========================================
// START
// ==========================================

loadStats();

loadVisitors();