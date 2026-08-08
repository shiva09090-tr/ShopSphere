const mobileToggle = document.getElementById("mobileToggle");
const menuBar = document.getElementById("menuBar");

mobileToggle?.addEventListener("click", () => {
    menuBar?.classList.toggle("open");
    const icon = mobileToggle.querySelector("i");
    icon?.classList.toggle("fa-bars");
    icon?.classList.toggle("fa-xmark");
});

menuBar?.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => menuBar.classList.remove("open"));
});

const topBtn = document.getElementById("topBtn");
window.addEventListener("scroll", () => {
    if (topBtn) topBtn.classList.toggle("show", window.scrollY > 500);
});

topBtn?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
