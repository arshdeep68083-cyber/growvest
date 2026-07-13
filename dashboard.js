import { auth, db } from "./firebase-config.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
  doc,
  getDoc,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// =========================
// HTML Elements
// =========================

const userEmail = document.getElementById("userEmail");
const balance = document.getElementById("balance");
const todayProfit = document.getElementById("todayProfit");
const activePlan = document.getElementById("activePlan");
const transactions = document.getElementById("transactions");
const logoutBtn = document.getElementById("logoutBtn");

const btcPrice = document.getElementById("btcPrice");
const ethPrice = document.getElementById("ethPrice");
const bnbPrice = document.getElementById("bnbPrice");
const solPrice = document.getElementById("solPrice");

const toggleBalance = document.getElementById("toggleBalance");

let balanceVisible = true;
let realBalance = "0.00 USDT";

// =========================
// Check Login
// =========================

onAuthStateChanged(auth, async (user) => {

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    if (userEmail) {
        userEmail.textContent = user.email;
    }

    try {

        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {

            const data = userSnap.data();

            realBalance =
                Number(data.balance || 0).toFixed(2) + " USDT";

            if (balance) {
                balance.textContent = realBalance;
            }

            if (todayProfit) {
                todayProfit.textContent =
                    "+" + Number(data.todayProfit || 0).toFixed(2) + " USDT";
            }

        }

        loadPlans(user.uid);
        loadTransactions(user.uid);
        loadCryptoPrices();

    } catch (error) {

        console.error("Dashboard Error:", error);

    }

});
// =========================
// Balance Show / Hide
// =========================

if (toggleBalance) {

    toggleBalance.addEventListener("click", () => {

        if (balanceVisible) {

            if (balance) {
                balance.textContent = "********";
            }

            toggleBalance.innerHTML =
                '<i class="fa-solid fa-eye-slash"></i>';

        } else {

            if (balance) {
                balance.textContent = realBalance;
            }

            toggleBalance.innerHTML =
                '<i class="fa-solid fa-eye"></i>';

        }

        balanceVisible = !balanceVisible;

    });

}

// =========================
// Live Crypto Prices
// =========================

async function loadCryptoPrices() {

    try {

        const response = await fetch(
            "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,binancecoin,solana&vs_currencies=usd"
        );

        const data = await response.json();

        if (btcPrice) btcPrice.textContent = "$" + data.bitcoin.usd;
        if (ethPrice) ethPrice.textContent = "$" + data.ethereum.usd;
        if (bnbPrice) bnbPrice.textContent = "$" + data.binancecoin.usd;
        if (solPrice) solPrice.textContent = "$" + data.solana.usd;

    } catch (error) {

        console.error("Crypto Price Error:", error);

    }

}

// =========================
// Load Active Plans
// =========================

async function loadPlans(uid) {

    if (!activePlan) return;

    activePlan.innerHTML = "";

    try {

        const plansSnapshot = await getDocs(collection(db, "userPlans"));

        let found = false;

        plansSnapshot.forEach((planDoc) => {

            const plan = planDoc.data();

            if (plan.uid === uid && plan.status === "Active") {

                found = true;

                activePlan.innerHTML += `
                    <div class="plan-card">
                        <h3>${plan.name}</h3>
                        <p>Investment: ${plan.amount} USDT</p>
                        <p>Monthly Profit: ${plan.monthlyProfit}%</p>
                        <span class="status active">${plan.status}</span>
                    </div>
                `;
            }

        });

        if (!found) {

            activePlan.innerHTML =
                "<div class='loading-card'>No Active Investment Plans</div>";

        }

    } catch (error) {

        console.error("Plans Error:", error);

    }

}
// =========================
// Load Recent Transactions
// =========================

async function loadTransactions(uid) {

    if (!transactions) return;

    transactions.innerHTML = "";

    try {

        const txSnapshot = await getDocs(collection(db, "transactions"));

        let found = false;

        txSnapshot.forEach((txDoc) => {

            const tx = txDoc.data();

            if (tx.uid === uid) {

                found = true;

                transactions.innerHTML += `
                    <div class="transaction-card">
                        <div>
                            <h4>${tx.type || "Transaction"}</h4>
                            <p>${tx.date || "--"}</p>
                        </div>

                        <div style="text-align:right">
                            <strong>${Number(tx.amount || 0).toFixed(2)} USDT</strong>
                            <br>
                            <span class="${tx.status === "Completed" ? "status active" : "status pending"}">
                                ${tx.status || "Pending"}
                            </span>
                        </div>
                    </div>
                `;

            }

        });

        if (!found) {

            transactions.innerHTML =
                "<div class='loading-card'>No Transactions Found</div>";

        }

    } catch (error) {

        console.error("Transaction Error:", error);

    }

}

// =========================
// Auto Refresh
// =========================

setInterval(() => {

    const user = auth.currentUser;

    if (user) {

        loadCryptoPrices();
        loadPlans(user.uid);
        loadTransactions(user.uid);

    }

}, 30000);

// =========================
// Logout
// =========================

if (logoutBtn) {

    logoutBtn.addEventListener("click", async () => {

        if (!confirm("Are you sure you want to logout?")) return;

        try {

            await signOut(auth);
            window.location.href = "login.html";

        } catch (error) {

            console.error(error);
            alert("Logout Failed!");

        }

    });

}

console.log("✅ GrowVest Premium Dashboard Loaded Successfully");
