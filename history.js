import { auth, db } from "./firebase-config.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
  collection,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const historyList = document.getElementById("historyList");

// ===== Format USDT =====
function formatUSDT(amount) {
  amount = Number(amount) || 0;

  return amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }) + " USDT";
}

// ===== Format Date =====
function formatDate(timestamp) {

  if (!timestamp) return "N/A";

  try {
    const date = timestamp.toDate();

    return date.toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short"
    });

  } catch {
    return "N/A";
  }

}

// ===== Status Badge =====
function statusBadge(status) {

  status = status || "Completed";

  let color = "#16c784";

  if (status === "Pending") color = "#f59e0b";
  if (status === "Rejected") color = "#ef4444";

  return `
    <span style="
      background:${color};
      color:#fff;
      padding:6px 12px;
      border-radius:20px;
      font-size:12px;
      font-weight:600;
      display:inline-block;
      margin-top:8px;
    ">
      ${status}
    </span>
  `;
}

onAuthStateChanged(auth, async (user) => {

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  historyList.innerHTML = "<p>Loading Transactions...</p>";

  try {

    let transactions = [];
        // ===== Deposit History =====
    const depositSnap = await getDocs(
      query(
        collection(db, "deposits"),
        where("uid", "==", user.uid)
      )
    );

    depositSnap.forEach((docSnap) => {

      const data = docSnap.data();

      transactions.push({
        type: "💰 Deposit",
        amount: data.amount,
        description: "USDT Deposit",
        status: data.status || "Pending",
        createdAt: data.createdAt || null
      });

    });

    // ===== Withdrawal History =====
    const withdrawSnap = await getDocs(
      query(
        collection(db, "withdrawals"),
        where("uid", "==", user.uid)
      )
    );

    withdrawSnap.forEach((docSnap) => {

      const data = docSnap.data();

      transactions.push({
        type: "💸 Withdrawal",
        amount: data.amount,
        description: "USDT Withdrawal",
        status: data.status || "Pending",
        createdAt: data.createdAt || null
      });

    });

    // ===== Other History =====
    const historySnap = await getDocs(
      query(
        collection(db, "history"),
        where("uid", "==", user.uid)
      )
    );

    historySnap.forEach((docSnap) => {

      const data = docSnap.data();

      transactions.push({
        type: data.type || "History",
        amount: data.amount,
        description: data.description || "-",
        status: data.status || "Completed",
        createdAt: data.createdAt || null
      });

    });

    // ===== Latest First =====
    transactions.sort((a, b) => {

      const timeA = a.createdAt ? a.createdAt.seconds : 0;
      const timeB = b.createdAt ? b.createdAt.seconds : 0;

      return timeB - timeA;

    });

    historyList.innerHTML = "";
        if (transactions.length === 0) {
      historyList.innerHTML = `
        <div class="card">
          <h3>No Transactions</h3>
          <p>Your transaction history is empty.</p>
        </div>
      `;
      return;
    }

    transactions.forEach((item) => {

      historyList.innerHTML += `
        <div class="card">

          <h3>${item.type}</h3>

          <p><b>Amount:</b> ${formatUSDT(item.amount)}</p>

          <p><b>Description:</b> ${item.description}</p>

          <p><b>Date:</b> ${formatDate(item.createdAt)}</p>

          ${statusBadge(item.status)}

        </div>

        <br>
      `;

    });

  } catch (error) {

    console.error(error);

    historyList.innerHTML = `
      <div class="card">
        <h3>❌ Error</h3>
        <p>${error.message}</p>
      </div>
    `;

  }

});
