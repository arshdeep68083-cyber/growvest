import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import {
  collection,
  getDocs,
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const usersList = document.getElementById("usersList");
const depositList = document.getElementById("depositList");
const withdrawList = document.getElementById("withdrawList");

window.approveDeposit = async function(id) {
  try {
    await updateDoc(doc(db, "deposits", id), {
      status: "Approved"
    });

    alert("Deposit Approved");
    location.reload();

  } catch (e) {
    alert(e.message);
  }
};

window.rejectDeposit = async function(id) {
  try {
    await updateDoc(doc(db, "deposits", id), {
      status: "Rejected"
    });

    alert("Deposit Rejected");
    location.reload();

  } catch (e) {
    alert(e.message);
  }
};

window.approveWithdraw = async function(id) {
  try {
    await updateDoc(doc(db, "withdrawals", id), {
      status: "Approved"
    });

    alert("Withdrawal Approved");
    location.reload();

  } catch (e) {
    alert(e.message);
  }
};

window.rejectWithdraw = async function(id) {
  try {
    await updateDoc(doc(db, "withdrawals", id), {
      status: "Rejected"
    });

    alert("Withdrawal Rejected");
    location.reload();

  } catch (e) {
    alert(e.message);
  }
};

onAuthStateChanged(auth, async (user) => {

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  usersList.innerHTML = "";
  depositList.innerHTML = "";
  withdrawList.innerHTML = "";
    try {

    // Users
    const usersSnap = await getDocs(collection(db, "users"));

    usersSnap.forEach((userDoc) => {
      const data = userDoc.data();

      usersList.innerHTML += `
      <div class="card">
        <h3>${data.name || "No Name"}</h3>
        <p>${data.email || ""}</p>
        <p>Balance: ₹${data.balance || 0}</p>
      </div>
      <br>
      `;
    });

    // Deposits
    const depSnap = await getDocs(collection(db, "deposits"));

    depSnap.forEach((depDoc) => {
      const data = depDoc.data();

      depositList.innerHTML += `
      <div class="card">
        <p><b>${data.email}</b></p>
        <p>Amount: ₹${data.amount}</p>
        <p>Status: ${data.status}</p>

        <button class="btn"
        onclick="approveDeposit('${depDoc.id}')">
        Approve
        </button>

        <button class="btn"
        onclick="rejectDeposit('${depDoc.id}')">
        Reject
        </button>
      </div>
      <br>
      `;
    });

    // Withdrawals
    const withSnap = await getDocs(collection(db, "withdrawals"));

    withSnap.forEach((withDoc) => {
      const data = withDoc.data();

      withdrawList.innerHTML += `
      <div class="card">
        <p><b>${data.email}</b></p>
        <p>Amount: ₹${data.amount}</p>
        <p>Status: ${data.status}</p>

        <button class="btn"
        onclick="approveWithdraw('${withDoc.id}')">
        Approve
        </button>

        <button class="btn"
        onclick="rejectWithdraw('${withDoc.id}')">
        Reject
        </button>
      </div>
      <br>
      `;
    });

  } catch (error) {
    alert(error.message);
  }

});