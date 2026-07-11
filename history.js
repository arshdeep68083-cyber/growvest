import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const historyList = document.getElementById("historyList");

onAuthStateChanged(auth, async (user) => {

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  historyList.innerHTML = "<p>Loading...</p>";

  try {

    historyList.innerHTML = "";

    // Deposits
    const depositQuery = query(
      collection(db, "deposits"),
      where("uid", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const depositSnap = await getDocs(depositQuery);

    depositSnap.forEach((doc) => {
      const data = doc.data();

      historyList.innerHTML += `
        <div class="card">
          <h3>Deposit</h3>
          <p>Amount: ₹${data.amount}</p>
          <p>Status: ${data.status}</p>
        </div><br>
      `;
    });

    // Withdrawals
    const withdrawQuery = query(
      collection(db, "withdrawals"),
      where("uid", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const withdrawSnap = await getDocs(withdrawQuery);

    withdrawSnap.forEach((doc) => {
      const data = doc.data();

      historyList.innerHTML += `
        <div class="card">
          <h3>Withdrawal</h3>
          <p>Amount: ₹${data.amount}</p>
          <p>Status: ${data.status}</p>
        </div><br>
      `;
    });

    if (historyList.innerHTML === "") {
      historyList.innerHTML = "<p>No transaction history found.</p>";
    }

  } catch (error) {
    historyList.innerHTML = "<p>" + error.message + "</p>";
  }

});