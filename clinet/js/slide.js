const slides=document.querySelectorAll(".slide");

const dots=document.querySelectorAll(".dot");

const next=document.querySelector(".next");

const prev=document.querySelector(".prev");

let index=0;

function showSlide(i){

slides.forEach(s=>s.classList.remove("active"));

dots.forEach(d=>d.classList.remove("active"));

slides[i].classList.add("active");

dots[i].classList.add("active");

}

next.onclick=()=>{

index++;

if(index>=slides.length)

index=0;

showSlide(index);

}

prev.onclick=()=>{

index--;

if(index<0)

index=slides.length-1;

showSlide(index);

}

setInterval(()=>{

index++;

if(index>=slides.length)

index=0;

showSlide(index);

},5000);

dots.forEach((dot,i)=>{

dot.onclick=()=>{

index=i;

showSlide(index);

}

});