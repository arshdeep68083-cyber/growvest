import { auth, db } from "./firebase-config.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
  doc,
  getDoc,
  updateDoc,
  addDoc,
  collection,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const buyBtn = document.getElementById("buyBtn");
const sellBtn = document.getElementById("sellBtn");
const amountInput = document.getElementById("amount");
const marketPrice = document.getElementById("marketPrice");
const positionBox = document.getElementById("positions");

let currentUser = null;
let balance = 0;
let btcPrice = 108250;

function updatePrice() {
  btcPrice += (Math.random() - 0.5) * 500;

  marketPrice.textContent =
    "$" +
    btcPrice.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
}

updatePrice();
setInterval(updatePrice, 3000);

onAuthStateChanged(auth, async (user) => {

  if (!user) {
    location.href = "login.html";
    return;
  }

  currentUser = user;

  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    balance = Number(userSnap.data().balance || 0);
  }

  positionBox.innerHTML = "<p>No Active Position</p>";
});
async function executeTrade(type) {

  if (!currentUser) {
    alert("Please login first.");
    return;
  }

  const amount = Number(amountInput.value.trim());

  if (isNaN(amount) || amount <= 0) {
    alert("Please enter a valid USDT amount.");
    return;
  }

  if (type === "BUY" && balance < amount) {
    alert("Insufficient balance.");
    return;
  }

  const userRef = doc(db, "users", currentUser.uid);

  if (type === "BUY") {
    balance -= amount;
  } else {
    balance += amount;
  }

  await updateDoc(userRef, {
    balance: balance
  });

  await addDoc(collection(db, "history"), {
    uid: currentUser.uid,
    email: currentUser.email,
    type: type,
    coin: "BTC",
    amount: amount,
    currency: "USDT",
    price: btcPrice,
    status: "Completed",
    createdAt: serverTimestamp()
  });

  positionBox.innerHTML = `
    <div class="position-item">
      <h3>${type} BTC</h3>
      <p>Amount: ${amount} USDT</p>
      <p>Price: $${btcPrice.toFixed(2)}</p>
      <p>Status: Completed</p>
    </div>
  `;

  amountInput.value = "";

  alert(type + " Order Placed Successfully!");
}
// ===== Button Events =====

buyBtn?.addEventListener("click", async () => {
  try {
    await executeTrade("BUY");
  } catch (error) {
    console.error("BUY Error:", error);
    alert("BUY Failed: " + error.message);
  }
});

sellBtn?.addEventListener("click", async () => {
  try {
    await executeTrade("SELL");
  } catch (error) {
    console.error("SELL Error:", error);
    alert("SELL Failed: " + error.message);
  }
});

// ===== Live Market Price =====

setInterval(() => {
  updatePrice();
}, 3000);

// ===== Page Loaded =====

window.addEventListener("DOMContentLoaded", () => {
  console.log("GrowVest Trading Loaded Successfully");
});