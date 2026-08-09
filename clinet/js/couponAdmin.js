const COUPON_API =
    "https://shopsphere-sedh.onrender.com/api/coupons";


const couponForm =
    document.getElementById("couponForm");

const couponList =
    document.getElementById("couponList");


// ==========================================
// CREATE COUPON
// ==========================================

couponForm?.addEventListener(
    "submit",
    async (e) => {

        e.preventDefault();


        const data = {

            code:
                document
                    .getElementById("couponCode")
                    .value
                    .trim()
                    .toUpperCase(),

            discountType:
                document
                    .getElementById("discountType")
                    .value,

            discountValue:
                Number(
                    document
                        .getElementById("discountValue")
                        .value
                ),

            usageLimit:
                Number(
                    document
                        .getElementById("usageLimit")
                        .value
                ),

            minimumOrder:
                Number(
                    document
                        .getElementById("minimumOrder")
                        .value
                ) || 0,

            expiryDate:
                document
                    .getElementById("expiryDate")
                    .value

        };


        try {

            const res =
                await fetch(
                    COUPON_API,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(data)
                    }
                );


            const result =
                await res.json();


            if (!res.ok) {

                throw new Error(
                    result.message ||
                    "Failed to create coupon"
                );

            }


            await Swal.fire({

                icon: "success",

                title:
                    "Coupon Created",

                text:
                    `${data.code} is now active`,

                timer: 1500,

                showConfirmButton:
                    false

            });


            couponForm.reset();

            loadCoupons();

        }

        catch (error) {

            Swal.fire({

                icon: "error",

                title: "Error",

                text:
                    error.message

            });

        }

    }
);


// ==========================================
// LOAD COUPONS
// ==========================================

async function loadCoupons() {

    try {

        const res =
            await fetch(
                COUPON_API
            );


        const result =
            await res.json();


        if (!res.ok) {
            throw new Error(
                result.message
            );
        }


        couponList.innerHTML = "";


        result.data.forEach(
            coupon => {

                const used =
                    coupon.usedCount || 0;

                const limit =
                    coupon.usageLimit;


                const remaining =
                    Math.max(
                        limit - used,
                        0
                    );


                couponList.innerHTML += `

                    <div class="coupon-card">

                        <div>

                            <h3>
                                🎟 ${coupon.code}
                            </h3>

                            <p>
                                Discount:
                                <strong>
                                    ${
                                        coupon.discountType ===
                                        "percentage"
                                            ? coupon.discountValue + "%"
                                            : "₹" + coupon.discountValue
                                    }
                                </strong>
                            </p>

                            <p>
                                Used:
                                ${used}/${limit}
                            </p>

                            <p>
                                Remaining:
                                ${remaining}
                            </p>

                            <p>
                                Minimum Order:
                                ₹${coupon.minimumOrder}
                            </p>

                            <p>
                                Expiry:
                                ${
                                    new Date(
                                        coupon.expiryDate
                                    ).toLocaleDateString(
                                        "en-IN"
                                    )
                                }
                            </p>

                        </div>


                        <button
                            type="button"
                            onclick="deleteCoupon('${coupon._id}')"
                            class="delete-coupon"
                        >
                            Delete
                        </button>

                    </div>

                `;

            }
        );

    }

    catch (error) {

        console.error(
            "Coupon loading error:",
            error
        );

        couponList.innerHTML =
            "<p>Unable to load coupons.</p>";

    }

}


async function deleteCoupon(id) {

    const confirm =
        await Swal.fire({

            title:
                "Delete Coupon?",

            text:
                "This cannot be undone.",

            icon:
                "warning",

            showCancelButton:
                true,

            confirmButtonText:
                "Delete"

        });


    if (!confirm.isConfirmed) {
        return;
    }


    try {

        const res =
            await fetch(
                `${COUPON_API}/${id}`,
                {
                    method:
                        "DELETE"
                }
            );


        const result =
            await res.json();


        if (!res.ok) {

            throw new Error(
                result.message
            );

        }


        loadCoupons();

    }

    catch (error) {

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


window.deleteCoupon =
    deleteCoupon;


loadCoupons();