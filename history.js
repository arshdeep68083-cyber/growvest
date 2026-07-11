import { auth, db } from "./firebase-config.js";

import {
  collection,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const historyList = document.getElementById("historyList");
const totalDeposits = document.getElementById("totalDeposits");
const totalWithdrawals = document.getElementById("totalWithdrawals");
const totalProfit = document.getElementById("totalProfit");

onAuthStateChanged(auth, async (user) => {

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  historyList.innerHTML = "";

  let deposits = 0;
  let withdrawals = 0;
  let profit = 0;

  const q = query(
    collection(db, "history"),
    where("uid", "==", user.uid)
  );

  const snapshot = await getDocs(q);
    snapshot.forEach((docSnap) => {
    const data = docSnap.data();

    const item = document.createElement("div");
    item.className = "card";

    item.innerHTML = `
      <p><strong>Type:</strong> ${data.type || "Transaction"}</p>
      <p><strong>Amount:</strong> ${data.amount || 0} USDT</p>
      <p><strong>Status:</strong> ${data.status || "Completed"}</p>
    `;

    historyList.appendChild(item);

    if (data.type === "Deposit") {
      deposits += Number(data.amount || 0);
    } else if (data.type === "Withdraw") {
      withdrawals += Number(data.amount || 0);
    } else if (data.type === "Profit") {
      profit += Number(data.amount || 0);
    }
  });

  if (snapshot.empty) {
    historyList.innerHTML = "<p>No transactions found.</p>";
  }

  totalDeposits.textContent = `${deposits.toFixed(2)} USDT`;
  totalWithdrawals.textContent = `${withdrawals.toFixed(2)} USDT`;
  totalProfit.textContent = `${profit.toFixed(2)} USDT`;

});
