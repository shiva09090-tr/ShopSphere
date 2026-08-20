const form = document.getElementById("loginForm");

const API = "https://shopsphere-sedh.onrender.com/api/auth/login";

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const user = {

        email: document.getElementById("email").value,

        password: document.getElementById("password").value

    };

    const response = await fetch(API, {

        method: "POST",

        headers: {

            "Content-Type":"application/json"

        },

        body: JSON.stringify(user)

    });

    const result = await response.json();
if (result.success) {

    console.log("LOGIN RESPONSE:", result);

    localStorage.setItem(
        "token",
        result.token || ""
    );

    // Backend me user kis naam se aa raha hai
    // usko handle karenge
    const loggedUser =
        result.user ||
        result.data ||
        result.userData;

    if (!loggedUser) {

        console.error(
            "❌ User data login response me nahi mila:",
            result
        );

        Swal.fire({
            icon: "error",
            title: "Login Error",
            text: "Login successful but user information was not received."
        });

        return;
    }

    localStorage.setItem(
        "user",
        JSON.stringify(loggedUser)
    );

    console.log(
        "✅ Saved User:",
        loggedUser
    );

    Swal.fire({
        icon: "success",
        title: "Login Successful",
        timer: 1200,
        showConfirmButton: false
    }).then(() => {

        window.location.href = "index.html";

    });

}
else {

    Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: result.message || "Invalid Email or Password"
    });

}
});