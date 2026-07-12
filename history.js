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

// ===== USDT Format =====
function formatUSDT(amount) {
  amount = Number(amount) || 0;

  return amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }) + " USDT";
}

onAuthStateChanged(auth, async (user) => {

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  historyList.innerHTML = "<p>Loading...</p>";

  try {

    historyList.innerHTML = "";

    // ===== Deposit History =====
    const depositSnap = await getDocs(
      query(
        collection(db, "deposits"),
        where("uid", "==", user.uid)
      )
    );

    depositSnap.forEach((docSnap) => {

      const data = docSnap.data();

      historyList.innerHTML += `
        <div class="card">
          <h3>💰 Deposit</h3>
          <p><b>Amount:</b> ${formatUSDT(data.amount)}</p>
          <p><b>Status:</b> ${data.status || "Pending"}</p>
        </div>
        <br>
      `;

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

      historyList.innerHTML += `
        <div class="card">
          <h3>💸 Withdrawal</h3>
          <p><b>Amount:</b> ${formatUSDT(data.amount)}</p>
          <p><b>Status:</b> ${data.status || "Pending"}</p>
        </div>
        <br>
      `;

    });

    // ===== Trading / Profit / Plan History =====
    const historySnap = await getDocs(
      query(
        collection(db, "history"),
        where("uid", "==", user.uid)
      )
    );

    historySnap.forEach((docSnap) => {

      const data = docSnap.data();

      historyList.innerHTML += `
        <div class="card">
          <h3>${data.type || "History"}</h3>
          <p><b>Amount:</b> ${formatUSDT(data.amount)}</p>
          <p><b>Description:</b> ${data.description || "-"}</p>
          <p><b>Status:</b> ${data.status || "Completed"}</p>
        </div>
        <br>
      `;

    });

    if (historyList.innerHTML === "") {
      historyList.innerHTML = "<p>No transaction history found.</p>";
    }

  } catch (error) {

    console.error(error);

    historyList.innerHTML = `
      <div class="card">
        <h3>Error</h3>
        <p>${error.message}</p>
      </div>
    `;

  }

});
