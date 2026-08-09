const API =
    "https://shopsphere-sedh.onrender.com/api/coupons";


const couponForm =
    document.getElementById("couponForm");

const couponList =
    document.getElementById("couponList");

const couponSubmit =
    document.getElementById("couponSubmit");

const cancelEdit =
    document.getElementById("cancelCouponEdit");


let editId = null;


// =====================================================
// LOAD COUPONS
// =====================================================

async function loadCoupons() {

    try {

        const response =
            await fetch(API);

        const result =
            await response.json();


        if (!response.ok) {

            throw new Error(
                result.message ||
                "Unable to load coupons"
            );

        }


        couponList.innerHTML = "";


        if (
            !result.data ||
            result.data.length === 0
        ) {

            couponList.innerHTML =
                "<p>No coupons found.</p>";

            return;

        }


        result.data.forEach(coupon => {

            const expiry =
                new Date(
                    coupon.expiryDate
                ).toLocaleString("en-IN");


            const status =
                coupon.active
                    ? "🟢 Active"
                    : "🔴 Inactive";


            couponList.innerHTML += `

                <div class="coupon-card">

                    <div>

                        <h2>
                            🎟️ ${coupon.code}
                        </h2>

                        <p>
                            ${status}
                        </p>

                        <p>
                            Discount:
                            <strong>
                                ${
                                    coupon.discountType ===
                                    "percentage"

                                    ? coupon.discountValue + "%"

                                    : "₹" +
                                      coupon.discountValue
                                }
                            </strong>
                        </p>

                        <p>
                            Minimum Order:
                            ₹${coupon.minimumOrder}
                        </p>

                        <p>
                            Usage:
                            ${coupon.usedCount}
                            /
                            ${coupon.usageLimit}
                        </p>

                        <p>
                            Expiry:
                            ${expiry}
                        </p>

                    </div>


                    <div class="coupon-actions">

                        <button
                            onclick="editCoupon('${coupon._id}')"
                        >
                            Edit
                        </button>


                        <button
                            class="deleteBtn"
                            onclick="deleteCoupon('${coupon._id}')"
                        >
                            Delete
                        </button>

                    </div>

                </div>

            `;

        });

    }

    catch (error) {

        console.error(error);

        couponList.innerHTML =
            "<p>Unable to load coupons.</p>";

    }

}


// =====================================================
// CREATE / UPDATE
// =====================================================

couponForm.addEventListener(
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

            minimumOrder:
                Number(
                    document
                        .getElementById("minimumOrder")
                        .value
                ) || 0,

            usageLimit:
                Number(
                    document
                        .getElementById("usageLimit")
                        .value
                ),

            expiryDate:
                document
                    .getElementById("expiryDate")
                    .value,

            active:
                document
                    .getElementById("active")
                    .checked

        };


        try {

            const url =
                editId
                    ? `${API}/${editId}`
                    : API;


            const method =
                editId
                    ? "PUT"
                    : "POST";


            couponSubmit.disabled = true;

            couponSubmit.innerText =
                editId
                    ? "Updating..."
                    : "Creating...";


            const response =
                await fetch(

                    url,

                    {
                        method,

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(data)

                    }

                );


            const result =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    result.message ||
                    "Request failed"
                );

            }


            await Swal.fire({

                icon: "success",

                title:
                    editId
                        ? "Coupon Updated"
                        : "Coupon Created",

                timer: 1300,

                showConfirmButton: false

            });


            resetCouponForm();

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

        finally {

            couponSubmit.disabled =
                false;

            couponSubmit.innerText =
                editId
                    ? "Update Coupon"
                    : "Create Coupon";

        }

    }
);


// =====================================================
// EDIT
// =====================================================

async function editCoupon(id) {

    try {

        const response =
            await fetch(
                `${API}/${id}`
            );


        /*
        IMPORTANT:
        Agar tumhare backend me single coupon
        GET route nahi hai to neeche wala
        loadCoupons wala method use karenge.
        */


        if (!response.ok) {

            throw new Error(
                "Unable to get coupon"
            );

        }


        const result =
            await response.json();


        const coupon =
            result.data;


        document
            .getElementById("couponCode")
            .value =
            coupon.code;


        document
            .getElementById("discountType")
            .value =
            coupon.discountType;


        document
            .getElementById("discountValue")
            .value =
            coupon.discountValue;


        document
            .getElementById("minimumOrder")
            .value =
            coupon.minimumOrder;


        document
            .getElementById("usageLimit")
            .value =
            coupon.usageLimit;


        const date =
            new Date(
                coupon.expiryDate
            );


        const localDate =
            new Date(
                date.getTime() -
                date.getTimezoneOffset() *
                60000
            )
            .toISOString()
            .slice(0, 16);


        document
            .getElementById("expiryDate")
            .value =
            localDate;


        document
            .getElementById("active")
            .checked =
            coupon.active;


        editId = id;


        document
            .getElementById("couponTitle")
            .innerText =
            "Update Coupon";


        couponSubmit.innerText =
            "Update Coupon";


        cancelEdit.style.display =
            "inline-block";


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

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


window.editCoupon =
    editCoupon;


// =====================================================
// DELETE
// =====================================================

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


    if (!confirm.isConfirmed)
        return;


    try {

        const response =
            await fetch(

                `${API}/${id}`,

                {
                    method:
                        "DELETE"
                }

            );


        const result =
            await response.json();


        if (!response.ok) {

            throw new Error(
                result.message ||
                "Delete failed"
            );

        }


        Swal.fire({

            icon: "success",

            title:
                "Coupon Deleted",

            timer: 1200,

            showConfirmButton:
                false

        });


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


window.deleteCoupon =
    deleteCoupon;


// =====================================================
// RESET
// =====================================================

function resetCouponForm() {

    couponForm.reset();

    document
        .getElementById("active")
        .checked = true;

    editId = null;


    document
        .getElementById("couponTitle")
        .innerText =
        "Create Coupon";


    couponSubmit.innerText =
        "Create Coupon";


    cancelEdit.style.display =
        "none";

}


cancelEdit.addEventListener(
    "click",
    resetCouponForm
);


// =====================================================
// START
// =====================================================

loadCoupons();