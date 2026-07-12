// =============================
// GrowVest App
// app.js - Part 1
// =============================

// Demo User Data
const user = {
    name: "Arshdeep",
    email: "arshdeep68083@gmail.com",
    balance: 12750.00,
    investment: 5500.00,
    todayProfit: 375.00,
    referralCode: "GV123456"
};

// Format USDT
function formatUSDT(value) {
    return Number(value).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }) + " USDT";
}

// Load Dashboard/Profile Data
window.addEventListener("DOMContentLoaded", () => {

    const balance = document.getElementById("balance");
    if (balance) balance.textContent = formatUSDT(user.balance);

    const investment = document.getElementById("investmentAmount");
    if (investment) investment.textContent = formatUSDT(user.investment);

    const profit = document.getElementById("todayProfit");
    if (profit) profit.textContent = "+" + formatUSDT(user.todayProfit);

    const email = document.getElementById("userEmail");
    if (email) email.textContent = user.email;

    const profileName = document.getElementById("profileName");
    if (profileName) profileName.textContent = user.name;

    const profileEmail = document.getElementById("profileEmail");
    if (profileEmail) profileEmail.textContent = user.email;

    const refCode = document.getElementById("refCode");
    if (refCode) refCode.textContent = user.referralCode;

});
// =============================
// app.js - Part 2
// =============================

// Investment Plans
const plans = [
    {
        name: "Starter Plan",
        min: 100,
        max: 999,
        profit: "5% Monthly"
    },
    {
        name: "Silver Plan",
        min: 1000,
        max: 4999,
        profit: "10% Monthly"
    },
    {
        name: "Gold Plan",
        min: 5000,
        max: 9999,
        profit: "15% Monthly"
    },
    {
        name: "VIP Plan",
        min: 10000,
        max: 99999,
        profit: "20% Monthly"
    }
];

// Show Plan Details
document.querySelectorAll(".plan-btn").forEach((btn, index) => {

    btn.addEventListener("click", () => {

        const plan = plans[index];

        if (!plan) return;

        alert(
            `Plan: ${plan.name}\n` +
            `Investment: $${plan.min} - $${plan.max}\n` +
            `Profit: ${plan.profit}`
        );

    });

});

// Copy Referral Link
function copyReferral() {

    const input =
        document.getElementById("referralLink") ||
        document.getElementById("refLink");

    if (!input) return;

    navigator.clipboard.writeText(input.value);

    alert("Referral link copied successfully!");

}

// Logout
const logoutBtn = document.querySelector(".logout-btn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", () => {

        localStorage.removeItem("user");

        window.location.href = "index.html";

    });

}
// =============================
// app.js - Part 3
// =============================

// Demo Referral Bonus
const referralBonus = 320.00;

const bonusElement = document.getElementById("referralBonus");

if (bonusElement) {
    bonusElement.textContent = formatUSDT(referralBonus);
}

// Deposit Button
document.querySelectorAll(".deposit").forEach(btn => {

    btn.addEventListener("click", () => {

        window.location.href = "deposit.html";

    });

});

// Withdraw Button
document.querySelectorAll(".withdraw").forEach(btn => {

    btn.addEventListener("click", () => {

        window.location.href = "withdraw.html";

    });

});

// Edit Profile
const editBtn = document.querySelector(".edit-profile");

if (editBtn) {

    editBtn.addEventListener("click", () => {

        const newName = prompt("Enter your new name:", user.name);

        if (newName && newName.trim() !== "") {

            user.name = newName.trim();

            const profileName = document.getElementById("profileName");

            if (profileName) {
                profileName.textContent = user.name;
            }

            alert("Profile updated successfully!");
        }

    });

}
// =============================
// app.js - Part 4 (Final)
// =============================

// Active Navigation
document.querySelectorAll(".nav-item").forEach(item => {

    item.addEventListener("click", () => {

        document.querySelectorAll(".nav-item").forEach(nav => {
            nav.classList.remove("active");
        });

        item.classList.add("active");

    });

});

// Copy Wallet Button (if exists)
const copyBtn = document.getElementById("copyBtn");

if (copyBtn) {

    copyBtn.addEventListener("click", () => {

        const wallet = document.getElementById("wallet");

        if (!wallet) return;

        navigator.clipboard.writeText(wallet.innerText);

        alert("Wallet address copied successfully!");

    });

}

console.log("✅ GrowVest App Loaded Successfully");
