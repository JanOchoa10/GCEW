const navItems = document.querySelectorAll(".navbar-item");
const navbarPill = document.querySelector(".navbar-pill");

navItems[0].addEventListener("click", () => {
    navbarPill.style.left="0px"
    onclick="window.location.href='gameplay.html';"
})
navItems[1].addEventListener("click", () => {
    navbarPill.style.left="117px"
})
navItems[2].addEventListener("click", () => {
    navbarPill.style.left="285px"
})