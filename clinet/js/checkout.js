const form = document.getElementById("checkoutForm");

form.addEventListener("submit",(e)=>{

e.preventDefault();

const customer={

name:document.getElementById("name").value,

phone:document.getElementById("phone").value,

email:document.getElementById("email").value,

address:document.getElementById("address").value,

city:document.getElementById("city").value,

state:document.getElementById("state").value,

pincode:document.getElementById("pincode").value

};

localStorage.setItem(

"customer",

JSON.stringify(customer)

);

window.location.href="summary.html";

});