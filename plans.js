import { auth, db } from "./firebase-config.js";

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
  collection,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const plansList = document.getElementById("plansList");

let currentUser = null;

function formatUSDT(amount) {
  amount = Number(amount) || 0;

  return amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }) + " USDT";
}

onAuthStateChanged(auth, (user) => {

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  currentUser = user;
  loadPlans();

});

async function loadPlans() {

  plansList.innerHTML = "";

  const snapshot = await getDocs(collection(db, "plans"));

  let plans = [];

  snapshot.forEach((docSnap) => {
    plans.push({
      id: docSnap.id,
      ...docSnap.data()
    });
  });

  plans.sort((a, b) => a.price - b.price);

  plans.forEach((plan) => {

    plansList.innerHTML += `
      <div class="card">

        <h2>${plan.name}</h2>

        <p><b>💰 Investment:</b> $${plan.minInvestment} - $${plan.maxInvestment}</p>

        <p><b>📈 Monthly Profit:</b> ${plan.monthlyProfit}%</p>

        <p><b>⏳ Duration:</b> ${plan.duration} Days</p>

        <p><b>✅ Status:</b> ${plan.status}</p>

        <button class="btn investBtn" data-id="${plan.id}">
          Buy Now
        </button>

      </div>

      <br>
    `;

  });

  document.querySelectorAll(".investBtn").forEach(btn => {

    btn.onclick = async () => {

      const plan = plans.find(p => p.id === btn.dataset.id);

      if (plan) {
        await buyPlan(plan);
      }

    };

  });

}

async function buyPlan(plan) {

  try {

    const userRef = doc(db, "users", currentUser.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      alert("User not found.");
      return;
    }

    const userData = userSnap.data();
    const balance = Number(userData.balance || 0);

    if (balance < Number(plan.price)) {
      alert("Insufficient Balance");
      return;
    }

    const newBalance = balance - Number(plan.price);

    await updateDoc(userRef, {
      balance: newBalance
    });

    await addDoc(collection(db, "userPlans"), {
      uid: currentUser.uid,
      email: currentUser.email,
      planName: plan.name,
      price: Number(plan.price),
      dailyProfit: Number(plan.dailyProfit),
      duration: Number(plan.duration),
      status: "Active",
      daysCompleted: 0,
      lastProfitDate: "",
      purchaseDate: serverTimestamp()
    });

    await addDoc(collection(db, "history"), {
      uid: currentUser.uid,
      email: currentUser.email,
      type: "Plan Purchase",
      amount: Number(plan.price),
      currency: "USDT",
      description: plan.name,
      status: "Completed",
      createdAt: serverTimestamp()
    });

    alert("Plan Purchased Successfully!");

    window.location.href = "dashboard.html";

  } catch (error) {

    console.error(error);
    alert(error.message);

  }

}

window.addEventListener("DOMContentLoaded", () => {
  console.log("GrowVest Plans Loaded Successfully");
});