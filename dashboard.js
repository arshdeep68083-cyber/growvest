// ======================================
// GrowVest Premium Dashboard
// dashboard.js - Part 1
// ======================================

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

// ---------- Firebase Config ----------
// ⚠️ Apna Firebase config ithhe paste karo

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// ---------- Initialize ----------

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ---------- Elements ----------

const emailEl = document.getElementById("userEmail");
const balanceEl = document.getElementById("balance");
const activePlanEl = document.getElementById("activePlan");
const todayProfitEl = document.getElementById("todayProfit");
const logoutBtn = document.getElementById("logoutBtn");

// ---------- Load User ----------

onAuthStateChanged(auth, async (user) => {

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  emailEl.textContent = user.email;

  try {

    const ref = doc(db, "users", user.uid);
    const snap = await getDoc(ref);

    if (snap.exists()) {

      const data = snap.data();

      balanceEl.textContent =
        (data.balance || 0).toFixed(2) + " USDT";

      todayProfitEl.textContent =
        "+" + (data.todayProfit || 0).toFixed(2) + " USDT";

    }

  } catch (err) {
    console.error(err);
  }

});
// ======================================
// dashboard.js - Part 2
// ======================================

// ---------- Balance Show / Hide ----------

let balanceVisible = true;

const toggleBtn = document.getElementById("toggleBalance");

if (toggleBtn) {

  toggleBtn.addEventListener("click", () => {

    balanceVisible = !balanceVisible;

    if (balanceVisible) {

      balanceEl.textContent =
        balanceEl.dataset.real || "0.00 USDT";

      toggleBtn.innerHTML = '<i class="fas fa-eye"></i>';

    } else {

      balanceEl.dataset.real = balanceEl.textContent;
      balanceEl.textContent = "********";

      toggleBtn.innerHTML = '<i class="fas fa-eye-slash"></i>';

    }

  });

}

// ---------- Live Crypto Prices ----------

async function loadPrices() {

  try {

    const res = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,binancecoin,solana,ripple&vs_currencies=usd"
    );

    const data = await res.json();

    const set = (id, value) => {
      const el = document.getElementById(id);
      if (el) el.textContent = "$" + Number(value).toLocaleString();
    };

    set("btcPrice", data.bitcoin.usd);
    set("ethPrice", data.ethereum.usd);
    set("bnbPrice", data.binancecoin.usd);
    set("solPrice", data.solana.usd);
    set("xrpPrice", data.ripple.usd);

  } catch (e) {

    console.log("Price Error", e);

  }

}

loadPrices();
setInterval(loadPrices, 30000);

// ---------- Active Investment Plan ----------

async function loadPlans(uid) {

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
        <p>Investment: ${plan.amount} USDT</p>
        <p>Daily Profit: ${plan.dailyProfit} USDT</p>
        <p>Status:
          <span style="color:#22c55e;">${plan.status}</span>
        </p>
      </div>
      `;

    });

  } catch (err) {

    console.log(err);

  }

}

// ---------- Load After Login ----------

onAuthStateChanged(auth, (user) => {

  if (user) {
    loadPlans(user.uid);
  }

});
// ======================================
// dashboard.js - Part 3
// ======================================

// ---------- Recent Transactions ----------

const transactionEl = document.getElementById("transactions");

async function loadTransactions(uid) {

  if (!transactionEl) return;

  try {

    const ref = doc(db, "users", uid);
    const snap = await getDoc(ref);

    if (!snap.exists()) return;

    const data = snap.data();

    if (!data.transactions || data.transactions.length === 0) {

      transactionEl.innerHTML =
        "<p>No Transactions Found</p>";

      return;

    }

    transactionEl.innerHTML = "";

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

          <div>
            <strong>${Number(tx.amount).toFixed(2)} USDT</strong><br>
            <span class="${tx.status.toLowerCase()}">
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

// ---------- Logout ----------

if (logoutBtn) {

  logoutBtn.addEventListener("click", async () => {

    try {

      await signOut(auth);
      window.location.href = "login.html";

    } catch (err) {

      alert("Logout Failed");

    }

  });

}

// ---------- Dashboard Load ----------

onAuthStateChanged(auth, (user) => {

  if (!user) return;

  loadPlans(user.uid);
  loadTransactions(user.uid);

});

// ---------- Auto Refresh ----------

setInterval(() => {

  const user = auth.currentUser;

  if (user) {

    loadPlans(user.uid);
    loadTransactions(user.uid);
    loadPrices();

  }

}, 30000);

// ======================================
// End of dashboard.js
// ======================================
