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

// ======================
// HTML Elements
// ======================

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

const toggleBtn = document.getElementById("toggleBalance");

let balanceVisible = true;
let originalBalance = "0.00 USDT";

// ======================
// Auth State
// ======================

onAuthStateChanged(auth, async (user) => {

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    if (userEmail)
        userEmail.textContent = user.email;

    try {

        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {

            const data = userSnap.data();

            originalBalance =
                Number(data.balance || 0).toFixed(2) + " USDT";

            if (balance)
                balance.textContent = originalBalance;

            if (todayProfit)
                todayProfit.textContent =
                    "+" + Number(data.todayProfit || 0).toFixed(2) + " USDT";

        }

        loadPlans(user.uid);
        loadTransactions(user.uid);
        loadPrices();

    } catch (err) {

        console.error(err);

    }

});
// ======================
// Balance Show / Hide
// ======================

if (toggleBtn) {

    toggleBtn.addEventListener("click", () => {

        if (balanceVisible) {

            if (balance)
                balance.textContent = "********";

            toggleBtn.innerHTML =
                '<i class="fa-solid fa-eye-slash"></i>';

        } else {

            if (balance)
                balance.textContent = originalBalance;

            toggleBtn.innerHTML =
                '<i class="fa-solid fa-eye"></i>';

        }

        balanceVisible = !balanceVisible;

    });

}

// ======================
// Live Crypto Prices
// ======================

async function loadPrices() {

    try {

        const res = await fetch(
            "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,binancecoin,solana&vs_currencies=usd"
        );

        const data = await res.json();

        if (btcPrice)
            btcPrice.textContent = "$" + data.bitcoin.usd;

        if (ethPrice)
            ethPrice.textContent = "$" + data.ethereum.usd;

        if (bnbPrice)
            bnbPrice.textContent = "$" + data.binancecoin.usd;

        if (solPrice)
            solPrice.textContent = "$" + data.solana.usd;

    } catch (err) {

        console.error("Price Error:", err);

    }

}

// ======================
// Active Plans
// ======================

async function loadPlans(uid) {

    if (!activePlan) return;

    try {

        const plansRef = collection(db, "userPlans");
        const snap = await getDocs(plansRef);

        activePlan.innerHTML = "";

        let count = 0;

        snap.forEach((doc) => {

            const plan = doc.data();

            if (plan.uid === uid && plan.status === "Active") {

                count++;

                activePlan.innerHTML += `
                <div class="plan-card">
                    <h3>${plan.name}</h3>
                    <p>Investment: ${plan.amount} USDT</p>
                    <p>Profit: ${plan.monthlyProfit}% Monthly</p>
                    <span class="status active">${plan.status}</span>
                </div>`;
            }

        });

        if (count === 0) {

            activePlan.innerHTML =
                "<p>No Active Investment Plans</p>";

        }

    } catch (err) {

        console.error(err);

    }

}
// ======================
// Recent Transactions
// ======================

async function loadTransactions(uid) {

    if (!transactions) return;

    try {

        const txRef = collection(db, "transactions");
        const snap = await getDocs(txRef);

        transactions.innerHTML = "";

        let found = false;

        snap.forEach((doc) => {

            const tx = doc.data();

            if (tx.uid === uid) {

                found = true;

                transactions.innerHTML += `

                <div class="transaction-card">

                    <div>
                        <h4>${tx.type}</h4>
                        <p>${tx.date || "--"}</p>
                    </div>

                    <div style="text-align:right">

                        <strong>${Number(tx.amount || 0).toFixed(2)} USDT</strong>

                        <br>

                        <span class="${tx.status === "Completed" ? "success" : "pending"}">
                            ${tx.status || "Pending"}
                        </span>

                    </div>

                </div>

                `;

            }

        });

        if (!found) {

            transactions.innerHTML =
                "<p>No transactions found.</p>";

        }

    } catch (err) {

        console.error(err);

    }

}

// ======================
// Auto Refresh
// ======================

setInterval(() => {

    const user = auth.currentUser;

    if (user) {

        loadPrices();
        loadPlans(user.uid);
        loadTransactions(user.uid);

    }

}, 30000);

// ======================
// Logout
// ======================

if (logoutBtn) {

    logoutBtn.addEventListener("click", async () => {

        if (!confirm("Are you sure you want to logout?"))
            return;

        try {

            await signOut(auth);

            window.location.href = "login.html";

        } catch (err) {

            console.error(err);
            alert("Logout failed!");

        }

    });

}

console.log("✅ GrowVest Premium Dashboard Loaded");
