import { auth, db } from "./firebase-config.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  updateDoc,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const usersList = document.getElementById("usersList");
const depositList = document.getElementById("depositList");
const withdrawList = document.getElementById("withdrawList");

const totalUsers = document.getElementById("totalUsers");
const totalDeposits = document.getElementById("totalDeposits");
const totalWithdrawals = document.getElementById("totalWithdrawals");
const activePlans = document.getElementById("activePlans");

async function updateUserBalance(uid, amount) {

  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    throw new Error("User not found");
  }

  const currentBalance = Number(userSnap.data().balance || 0);

  await updateDoc(userRef, {
    balance: currentBalance + Number(amount)
  });

}

onAuthStateChanged(auth, async (user) => {

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  if (user.email !== "growvestsupport78@gmail.com") {
    alert("Access Denied!");
    window.location.href = "dashboard.html";
    return;
  }

  usersList.innerHTML = "<p>Loading...</p>";
  depositList.innerHTML = "<p>Loading...</p>";
  withdrawList.innerHTML = "<p>Loading...</p>";

  try {

    const usersSnap = await getDocs(collection(db, "users"));

    totalUsers.textContent = usersSnap.size;

    const depAll = await getDocs(collection(db, "deposits"));

    let depTotal = 0;

    depAll.forEach((docSnap) => {
      const data = docSnap.data();

      if (data.status === "Approved") {
        depTotal += Number(data.amount || 0);
      }
    });

    totalDeposits.textContent = depTotal;

    const withAll = await getDocs(collection(db, "withdrawals"));

    let withTotal = 0;

    withAll.forEach((docSnap) => {
      const data = docSnap.data();

      if (data.status === "Approved") {
        withTotal += Number(data.amount || 0);
      }
    });

    totalWithdrawals.textContent = withTotal;

    const planSnap = await getDocs(
      query(
        collection(db, "userPlans"),
        where("status", "==", "Active")
      )
    );

    activePlans.textContent = planSnap.size;
        usersList.innerHTML = "";

    usersSnap.forEach((u) => {

      const data = u.data();

      usersList.innerHTML += `
      <div class="card">
        <h3>${data.name || "No Name"}</h3>
        <p>${data.email}</p>
        <p><b>Balance:</b> ₹${data.balance || 0}</p>
      </div><br>
      `;
    });

    // Pending Deposits

    const depSnap = await getDocs(
      query(
        collection(db, "deposits"),
        where("status", "==", "Pending")
      )
    );

    depositList.innerHTML = "";

    depSnap.forEach((d) => {

      const data = d.data();

      depositList.innerHTML += `
      <div class="card">
        <h3>${data.email}</h3>
        <p><b>Amount:</b> ₹${data.amount}</p>
        <p><b>Status:</b> ${data.status}</p>

        <button class="btn"
        onclick="approveDeposit('${d.id}')">
        ✅ Approve
        </button>

        <button class="btn"
        onclick="rejectDeposit('${d.id}')">
        ❌ Reject
        </button>

      </div><br>
      `;
    });

    // Pending Withdrawals

    const withSnap = await getDocs(
      query(
        collection(db, "withdrawals"),
        where("status", "==", "Pending")
      )
    );

    withdrawList.innerHTML = "";

    withSnap.forEach((w) => {

      const data = w.data();

      withdrawList.innerHTML += `
      <div class="card">
        <h3>${data.email}</h3>
        <p><b>Amount:</b> ₹${data.amount}</p>
        <p><b>Wallet:</b> ${data.wallet}</p>
        <p><b>Status:</b> ${data.status}</p>

        <button class="btn"
        onclick="approveWithdraw('${w.id}')">
        ✅ Approve
        </button>

        <button class="btn"
        onclick="rejectWithdraw('${w.id}')">
        ❌ Reject
        </button>

      </div><br>
      `;
    });

  } catch (error) {
    alert(error.message);
  }

});
// =========================
// Deposit Approve
// =========================

window.approveDeposit = async function (id) {

  try {

    const depRef = doc(db, "deposits", id);
    const depSnap = await getDoc(depRef);

    if (!depSnap.exists()) {
      alert("Deposit not found");
      return;
    }

    const data = depSnap.data();

    if (data.status !== "Pending") {
      alert("Already processed");
      return;
    }

    await updateUserBalance(data.uid, Number(data.amount));

    await updateDoc(depRef, {
      status: "Approved"
    });

    await addDoc(collection(db, "history"), {
      uid: data.uid,
      email: data.email,
      type: "Deposit",
      amount: Number(data.amount),
      status: "Approved",
      description: "Deposit Approved",
      createdAt: serverTimestamp()
    });

    alert("Deposit Approved Successfully!");
    location.reload();

  } catch (error) {
    alert(error.message);
  }

};

// =========================
// Deposit Reject
// =========================

window.rejectDeposit = async function (id) {

  try {

    await updateDoc(doc(db, "deposits", id), {
      status: "Rejected"
    });

    alert("Deposit Rejected");
    location.reload();

  } catch (error) {
    alert(error.message);
  }

};

// =========================
// Withdraw Approve
// =========================

window.approveWithdraw = async function (id) {

  try {

    const withRef = doc(db, "withdrawals", id);
    const withSnap = await getDoc(withRef);

    if (!withSnap.exists()) {
      alert("Withdrawal not found");
      return;
    }

    const data = withSnap.data();

    if (data.status !== "Pending") {
      alert("Already processed");
      return;
    }

    const userRef = doc(db, "users", data.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      alert("User not found");
      return;
    }

    const balance = Number(userSnap.data().balance || 0);

    if (balance < Number(data.amount)) {
      alert("Insufficient Balance");
      return;
    }

    await updateDoc(userRef, {
      balance: balance - Number(data.amount)
    });

    await updateDoc(withRef, {
      status: "Approved"
    });

    await addDoc(collection(db, "history"), {
      uid: data.uid,
      email: data.email,
      type: "Withdrawal",
      amount: Number(data.amount),
      status: "Approved",
      description: "Withdrawal Approved",
      createdAt: serverTimestamp()
    });

    alert("Withdrawal Approved Successfully!");
    location.reload();

  } catch (error) {
    alert(error.message);
  }

};

// =========================
// Withdraw Reject
// =========================

window.rejectWithdraw = async function (id) {

  try {

    await updateDoc(doc(db, "withdrawals", id), {
      status: "Rejected"
    });

    alert("Withdrawal Rejected");
    location.reload();

  } catch (error) {
    alert(error.message);
  }

};
