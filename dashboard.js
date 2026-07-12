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

// ================= Firebase Config =================
// Replace with your own Firebase project details

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// ================= Initialize Firebase =================

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ================= HTML Elements =================

const balanceEl = document.getElementById("balance");
const emailEl = document.getElementById("userEmail");
const todayProfitEl = document.getElementById("todayProfit");
const logoutBtn = document.getElementById("logoutBtn");
const activePlanEl = document.getElementById("activePlan");

// ================= Load Logged-in User =================

onAuthStateChanged(auth, async (user) => {

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  emailEl.textContent = user.email;

  try {

    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);

    if (!snap.exists()) return;

    const data = snap.data();

    balanceEl.textContent =
      Number(data.balance || 0).toFixed(2) + " USDT";

    todayProfitEl.textContent =
      "+" + Number(data.todayProfit || 0).toFixed(2) + " USDT";

  } catch (error) {

    console.error("User Load Error:", error);

  }

});
// =====================================
// dashboard.js - Part 2
// =====================================

// ================= Balance Show / Hide =================

const toggleBtn = document.getElementById("toggleBalance");

let balanceVisible = true;
let realBalance = "";

if (toggleBtn) {

  toggleBtn.addEventListener("click", () => {

    if (balanceVisible) {

      realBalance = balanceEl.textContent;
      balanceEl.textContent = "********";

      toggleBtn.innerHTML =
        '<i class="fas fa-eye-slash"></i>';

    } else {

      balanceEl.textContent = realBalance;

      toggleBtn.innerHTML =
        '<i class="fas fa-eye"></i>';

    }

    balanceVisible = !balanceVisible;

  });

}

// ================= Live Crypto Prices =================

async function loadPrices() {

  try {

    const response = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,binancecoin,solana,ripple&vs_currencies=usd"
    );

    const data = await response.json();

    const setPrice = (id, value) => {
      const el = document.getElementById(id);
      if (el) {
        el.textContent = "$" + Number(value).toLocaleString();
      }
    };

    setPrice("btcPrice", data.bitcoin.usd);
    setPrice("ethPrice", data.ethereum.usd);
    setPrice("bnbPrice", data.binancecoin.usd);
    setPrice("solPrice", data.solana.usd);
    setPrice("xrpPrice", data.ripple.usd);

  } catch (err) {

    console.log("Price Error:", err);

  }

}

// First Load
loadPrices();

// Refresh Every 30 Seconds
setInterval(loadPrices, 30000);

// ================= Active Investment Plans =================

async function loadPlans(uid) {

  if (!activePlanEl) return;

  try {

    const ref = doc(db, "users", uid);
    const snap = await getDoc(ref);

    if (!snap.exists()) return;

    const data = snap.data();

    if (!data.activePlans || data.activePlans.length === 0) {

      activePlanEl.innerHTML =
        "<p>No Active Investment Plan</p>";

      return;

    }

    activePlanEl.innerHTML = "";

    data.activePlans.forEach(plan => {

      activePlanEl.innerHTML += `

      <div class="plan-card">

        <h4>${plan.name}</h4>

        <p><strong>Investment:</strong> ${plan.amount} USDT</p>

        <p><strong>Monthly Profit:</strong> ${plan.monthlyProfit}%</p>

        <p>
          <strong>Status:</strong>
          <span style="color:#22c55e;">
            ${plan.status}
          </span>
        </p>

      </div>

      `;

    });

  } catch (err) {

    console.error(err);

  }

}

// Load Plans After Login

onAuthStateChanged(auth, (user) => {

  if (user) {

    loadPlans(user.uid);

  }

});
// =====================================
// dashboard.js - Part 3 (Final)
// =====================================

// ================= Recent Transactions =================

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

      transactionEl.innerHTML =
        "<p>No Transactions Found</p>";

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

            <div style="text-align:right;">
              <strong>${Number(tx.amount).toFixed(2)} USDT</strong><br>

              <span style="color:${
                tx.status === "Completed"
                  ? "#22c55e"
                  : "#facc15"
              };">
                ${tx.status}
              </span>
            </div>

          </div>
        `;

      });

  } catch (err) {

    console.error("Transaction Error:", err);

  }

}

// ================= Dashboard Auto Load =================

onAuthStateChanged(auth, (user) => {

  if (!user) return;

  loadPlans(user.uid);
  loadTransactions(user.uid);

});

// ================= Auto Refresh =================

setInterval(() => {

  const user = auth.currentUser;

  if (user) {

    loadPrices();
    loadPlans(user.uid);
    loadTransactions(user.uid);

  }

}, 30000);

// ================= Logout =================

if (logoutBtn) {

  logoutBtn.addEventListener("click", async () => {

    const ok = confirm("Are you sure you want to logout?");

    if (!ok) return;

    try {

      await signOut(auth);

      window.location.href = "login.html";

    } catch (err) {

      alert("Logout Failed!");

      console.error(err);

    }

  });

}

// ================= Welcome =================

console.log("GrowVest Dashboard Loaded Successfully");
