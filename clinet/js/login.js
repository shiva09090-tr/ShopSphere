const form = document.getElementById("loginForm");

const API = "http://localhost:5000/api/auth/login";

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

    if(result.success){

        localStorage.setItem("token", result.token);

        localStorage.setItem("user", JSON.stringify(result.user));

        Swal.fire({
    icon:"success",
    title:"Login Successful",
    timer:1200,
    showConfirmButton:false
});
Swal.fire({
    icon:"error",
    title:"Login Failed",
    text:"Invalid Email or Password"
});

        window.location.href="index.html";

    }else{

        alert(result.message);

    }

});