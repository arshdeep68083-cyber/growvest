import { auth, db } from "./firebase.js";
import {
  collection,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

auth.onAuthStateChanged(async (user) => {
  if (!user) {
    location.href = "login.html";
    return;
  }

  const historyList = document.getElementById("historyList");
  const totalDeposit = document.getElementById("totalDeposit");
  const totalWithdraw = document.getElementById("totalWithdraw");
  const totalProfit = document.getElementById("totalProfit");

  let deposit = 0;
  let withdraw = 0;
  let profit = 0;

  historyList.innerHTML = "";

  const q = query(
    collection(db, "transactions"),
    where("uid", "==", user.uid)
  );

  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    historyList.innerHTML = `
      <div class="card">
        <h3>No Transactions Found</h3>
        <p>Your transaction history will appear here.</p>
      </div>
    `;
    return;
  }

  snapshot.forEach((doc) => {
    const data = doc.data();

    const type = data.type || "Transaction";
    const amount = Number(data.amount || 0);
    const status = data.status || "Pending";
    const date = data.date || "";

    if (type === "Deposit") deposit += amount;
    if (type === "Withdraw") withdraw += amount;
    if (type === "Profit") profit += amount;

    let icon = "fa-wallet";
    let color = "deposit";

    if (type === "Withdraw") {
      icon = "fa-arrow-up";
      color = "withdraw";
    }

    if (type === "Profit") {
      icon = "fa-chart-line";
      color = "profit";
    }

    historyList.innerHTML += `
      <div class="history-item">
        <div class="history-left">
          <div class="history-icon ${color}">
            <i class="fas ${icon}"></i>
          </div>

          <div>
            <div class="history-name">${type}</div>
            <div class="history-date">${date}</div>
          </div>
        </div>

        <div class="history-right">
          <div class="history-amount">${amount} USDT</div>
          <span class="status status-${status.toLowerCase()}">${status}</span>
        </div>
      </div>
    `;
  });

  totalDeposit.textContent = deposit + " USDT";
  totalWithdraw.textContent = withdraw + " USDT";
  totalProfit.textContent = profit + " USDT";
});
