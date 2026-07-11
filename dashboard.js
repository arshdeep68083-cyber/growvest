// ===================================
// GrowVest Dashboard JS - Part 1
// ===================================

document.addEventListener("DOMContentLoaded", () => {

    console.log("GrowVest Loaded Successfully");

    // Active Navigation
    const currentPage = window.location.pathname.split("/").pop();

    document.querySelectorAll(".bottom-nav a").forEach(link => {

        const href = link.getAttribute("href");

        if (href === currentPage) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }

    });

    // Welcome Animation
    document.querySelectorAll(
        ".overview-card, .coin-card, .market-box, .benefit-card, .news-card"
    ).forEach((card, index) => {

        card.style.opacity = "0";
        card.style.transform = "translateY(20px)";

        setTimeout(() => {
            card.style.transition = "0.5s ease";
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
        }, index * 100);

    });

});
// ===================================
// GrowVest Dashboard JS - Part 2
// ===================================

// Button Click Effects
document.querySelectorAll(".action-btn").forEach(button => {

    button.addEventListener("click", function () {

        this.style.transform = "scale(0.96)";

        setTimeout(() => {
            this.style.transform = "scale(1)";
        }, 150);

    });

});

// Coin Card Hover Effect
document.querySelectorAll(".coin-card").forEach(card => {

    card.addEventListener("mouseenter", () => {
        card.style.boxShadow = "0 20px 35px rgba(34,197,94,0.25)";
    });

    card.addEventListener("mouseleave", () => {
        card.style.boxShadow = "";
    });

});

// Simple Greeting
const welcome = document.querySelector(".welcome h1");

if (welcome) {

    const hour = new Date().getHours();

    if (hour < 12) {
        welcome.innerHTML = "🌞 Good Morning";
    } else if (hour < 18) {
        welcome.innerHTML = "☀️ Good Afternoon";
    } else {
        welcome.innerHTML = "🌙 Good Evening";
    }

}

console.log("GrowVest Dashboard Ready 🚀");
