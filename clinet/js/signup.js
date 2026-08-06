const form = document.getElementById("signupForm");

const API = "http://localhost:5000/api/auth/register";

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const user = {

        name: document.getElementById("name").value,

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

    alert(result.message);

    if(result.success){

        window.location.href="login.html";

    }

});