function loginAdmin(){

const username=document.getElementById("username").value;

const password=document.getElementById("password").value;

if(username==="admin" && password==="admin123"){

localStorage.setItem("admin","true");

window.location="admin.html";

}

else{

alert("Invalid Admin");

}

}