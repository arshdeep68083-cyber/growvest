// =====================================
// GrowVest Dashboard
// dashboard.js - Part 1
// =====================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  getFirestore,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Firebase Config

const firebaseConfig = {
  apiKey: "AIzaSyCmPFHqp9LtrHFklqo_nD2wl7L_IWlY0SA",
  authDomain: "growvest-4eb24.firebaseapp.com",
  projectId: "growvest-4eb24",
  storageBucket: "growvest-4eb24.firebasestorage.app",
  messagingSenderId: "516443488034",
  appId: "1:516443488034:web:5cab0f21e4f840ebab2f7b"
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// HTML Elements

const balanceEl = document.getElementById("balance");
const emailEl = document.getElementById("userEmail");
const todayProfitEl = document.getElementById("todayProfit");
const logoutBtn = document.getElementById("logoutBtn");
const activePlanEl = document.getElementById("activePlan");

// Load Logged-in User

onAuthStateChanged(auth, async (user) => {

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  emailEl.textContent = user.email;

  try {

    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);

    if (snap.exists()) {

      const data = snap.data();

      balanceEl.textContent =
        Number(data.balance || 0).toFixed(2) + " USDT";

      if (todayProfitEl) {
        todayProfitEl.textContent =
          "+" + Number(data.todayProfit || 0).toFixed(2) + " USDT";
      }

    }

  } catch (err) {
    console.log(err);
  }

});
// =====================================
// dashboard.js - Part 2
// =====================================

// ===== Balance Show / Hide =====

const toggleBtn = document.getElementById("toggleBalance");

let balanceVisible = true;
let actualBalance = "";

if (toggleBtn) {

    toggleBtn.addEventListener("click", () => {

        if (balanceVisible) {

            actualBalance = balanceEl.textContent;
            balanceEl.textContent = "********";

            toggleBtn.innerHTML =
                '<i class="fas fa-eye-slash"></i>';

        } else {

            balanceEl.textContent = actualBalance;

            toggleBtn.innerHTML =
                '<i class="fas fa-eye"></i>';

        }

        balanceVisible = !balanceVisible;

    });

}

// ===== Load Live Crypto Prices =====

async function loadPrices() {

    try {

        const response = await fetch(
            "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,binancecoin,solana&vs_currencies=usd"
        );

        const data = await response.json();

        const btc = document.getElementById("btcPrice");
        const eth = document.getElementById("ethPrice");
        const bnb = document.getElementById("bnbPrice");
        const sol = document.getElementById("solPrice");

        if (btc) btc.innerText = "$" + data.bitcoin.usd;
        if (eth) eth.innerText = "$" + data.ethereum.usd;
        if (bnb) bnb.innerText = "$" + data.binancecoin.usd;
        if (sol) sol.innerText = "$" + data.solana.usd;

    } catch (err) {

        console.log("Price Error:", err);

    }

}

// First Load
loadPrices();

// Refresh Every 30 Seconds
setInterval(loadPrices, 30000);

// ===== Load Active Investment Plan =====

async function loadPlans(uid) {

    try {

        const ref = doc(db, "users", uid);
        const snap = await getDoc(ref);

        if (!snap.exists()) return;

        const data = snap.data();

        if (!activePlanEl) return;

        if (!data.activePlans || data.activePlans.length === 0) {

            activePlanEl.innerHTML =
                "<p>No Active Investment</p>";

            return;

        }

        activePlanEl.innerHTML = "";

        data.activePlans.forEach(plan => {

            activePlanEl.innerHTML += `

            <div class="plan-card">

                <h4>${plan.name}</h4>

                <p><strong>Investment:</strong> ${plan.amount} USDT</p>

                <p><strong>Monthly Profit:</strong> ${plan.monthlyProfit}%</p>

                <p><strong>Status:</strong>
                <span style="color:#22c55e">${plan.status}</span>
                </p>

            </div>

            `;

        });

    } catch (err) {

        console.log(err);

    }

}

onAuthStateChanged(auth, (user) => {

    if (user) {

        loadPlans(user.uid);

    }

});
// =====================================
// dashboard.js - Part 3 (Final)
// =====================================

// ===== Recent Transactions =====

const transactionEl = document.getElementById("transactions");

async function loadTransactions(uid) {

    if (!transactionEl) return;

    try {

        const ref = doc(db, "users", uid);
        const snap = await getDoc(ref);

        if (!snap.exists()) return;

        const data = snap.data();

        transactionEl.innerHTML = "";

        if (!data.transactions || data.transactions.length === 0) {

            transactionEl.innerHTML = `
                <p>No Transactions Found</p>
            `;
            return;

        }

        data.transactions
            .slice()
            .reverse()
            .forEach(tx => {

                transactionEl.innerHTML += `

                <div class="transaction-card">

                    <div>
                        <h4>${tx.type}</h4>
                        <p>${tx.date}</p>
                    </div>

                    <div style="text-align:right">
                        <strong>${Number(tx.amount).toFixed(2)} USDT</strong><br>
                        <span style="color:${tx.status === "Completed" ? "#22c55e" : "#facc15"}">
                            ${tx.status}
                        </span>
                    </div>

                </div>

                `;

            });
} catch (err) {
    console.error(err);
    }
  

    }

}

// ===== Load Dashboard =====

onAuthStateChanged(auth, (user) => {

    if (!user) return;

    loadPlans(user.uid);
    loadTransactions(user.uid);

});

// ===== Auto Refresh =====

setInterval(() => {

    const user = auth.currentUser;

    if (user) {

        loadPrices();
        loadPlans(user.uid);
        loadTransactions(user.uid);

    }

}, 30000);

// ===== Logout =====

if (logoutBtn) {

    logoutBtn.addEventListener("click", async () => {

        const ok = confirm("Are you sure you want to logout?");

        if (!ok) return;

        try {

            await signOut(auth);

            window.location.href = "login.html";

        } catch (err) {

            alert("Logout failed!");
            console.error(err);

        }

    });

}

console.log("GrowVest Dashboard Loaded Successfully");
