import { auth, db } from "./firebase-config.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const tradeAmount = document.getElementById("tradeAmount");
const tradeType = document.getElementById("tradeType");
const startTrade = document.getElementById("startTrade");
const tradeStatus = document.getElementById("tradeStatus");
const todayProfit = document.getElementById("todayProfit");
const activeTrades = document.getElementById("activeTrades");

let currentUser = null;

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  currentUser = user;

  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    const data = userSnap.data();

    todayProfit.textContent = `${data.todayProfit || 0} USDT`;
    activeTrades.textContent = data.activeTrades || 0;
  }
});

startTrade.addEventListener("click", async () => {
  if (!currentUser) return;

  const amount = Number(tradeAmount.value);
  const type = tradeType.value;

  if (!amount || amount <= 0) {
    alert("Please enter a valid amount.");
    return;
  }
    tradeStatus.textContent =
    `Processing ${type.toUpperCase()} trade of ${amount} USDT...`;

  try {
    // Note:
    // Is example vich sirf UI update ho reha hai.
    // Real trading, balance deduction, ya profit calculation
    // backend/server te securely karni chahidi hai.

    setTimeout(() => {
      tradeStatus.textContent =
        `✅ ${type.toUpperCase()} trade request submitted successfully.`;
    }, 1500);

    tradeAmount.value = "";

  } catch (error) {
    console.error(error);
    tradeStatus.textContent = "❌ Trade request failed.";
  }
});
