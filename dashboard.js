import { auth, db } from "./firebase-config.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const userEmail = document.getElementById("userEmail");
const balance = document.getElementById("balance");
const activePlan = document.getElementById("activePlan");
const logoutBtn = document.getElementById("logoutBtn");

onAuthStateChanged(auth, async (user) => {

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  userEmail.textContent = user.email;

  try {

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {

      const data = userSnap.data();

      balance.textContent =
        (data.balance || 0).toFixed(2) + " USDT";

      if (data.activePlan) {

        activePlan.innerHTML = `
          <h3>${data.activePlan}</h3>
          <p>Investment Active</p>
        `;

      } else {

        activePlan.innerHTML = `
          <p>No Active Plan</p>
        `;

      }

    }

  } catch (err) {
    console.error(err);
  }

});

logoutBtn.addEventListener("click", async () => {

  await signOut(auth);

  window.location.href = "login.html";

});

// ===== Live Crypto Prices =====

async function loadCryptoPrices() {

  try {

    const res = await fetch(
      "https://api.binance.com/api/v3/ticker/price?symbols=%5B%22BTCUSDT%22,%22ETHUSDT%22,%22BNBUSDT%22,%22SOLUSDT%22%5D"
    );

    const prices = await res.json();

    document.getElementById("btcPrice").textContent =
      "$" + Number(prices[0].price).toLocaleString();

    document.getElementById("ethPrice").textContent =
      "$" + Number(prices[1].price).toLocaleString();

    document.getElementById("bnbPrice").textContent =
      "$" + Number(prices[2].price).toLocaleString();

    document.getElementById("solPrice").textContent =
      "$" + Number(prices[3].price).toLocaleString();

  } catch (error) {

    console.error("Price Load Error:", error);

    document.getElementById("btcPrice").textContent = "--";
    document.getElementById("ethPrice").textContent = "--";
    document.getElementById("bnbPrice").textContent = "--";
    document.getElementById("solPrice").textContent = "--";

  }

}

// First Load
loadCryptoPrices();

// Refresh every 10 seconds
setInterval(loadCryptoPrices, 10000);
// ===== Dashboard Final Setup =====

function startDashboard() {
  console.log("GrowVest Dashboard Loaded");
}

// Refresh active plan every 30 seconds
async function refreshDashboard() {
  const user = auth.currentUser;

  if (!user) return;

  try {
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const data = userSnap.data();

      balance.textContent =
        (data.balance || 0).toFixed(2) + " USDT";

      if (data.activePlan) {
        activePlan.innerHTML = `
          <h3>${data.activePlan}</h3>
          <p>Investment Active</p>
        `;
      } else {
        activePlan.innerHTML = `
          <p>No Active Plan</p>
        `;
      }
    }

  } catch (err) {
    console.error("Dashboard Refresh Error:", err);
  }
}

// Refresh dashboard every 30 seconds
setInterval(refreshDashboard, 30000);

// Start dashboard
startDashboard();
