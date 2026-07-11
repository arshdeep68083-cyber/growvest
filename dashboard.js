import { auth, db } from "./firebase-config.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// ===== Format Money =====
function formatMoney(amount) {
  amount = Number(amount) || 0;

  return amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }) + " USDT";
}

// ===== Elements =====
const emailBox = document.getElementById("userEmail");
const balanceBox = document.getElementById("balance");
const logoutBtn = document.getElementById("logoutBtn");
const activePlanBox = document.getElementById("activePlan");

const investmentBox = document.getElementById("investmentAmount");
const todayProfitBox = document.getElementById("todayProfit");

// ===== Auth =====
onAuthStateChanged(auth, async (user) => {

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  emailBox.textContent = user.email;

  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    alert("User not found");
    return;
  }

  let userData = userSnap.data();

  let balance = Number(userData.balance || 0);

  let totalInvestment = 0;
  let todayProfit = 0;

  try {

    const plansQuery = query(
      collection(db, "userPlans"),
      where("uid", "==", user.uid),
      where("status", "==", "Active")
    );

    const plansSnap = await getDocs(plansQuery);

    activePlanBox.innerHTML = "";

    const today = new Date().toISOString().split("T")[0];
        for (const planDoc of plansSnap.docs) {

      const plan = planDoc.data();

      let completedDays = Number(plan.daysCompleted || 0);

      totalInvestment += Number(plan.price);
      todayProfit += Number(plan.dailyProfit);

      if (plan.lastProfitDate !== today) {

        completedDays++;
        balance += Number(plan.dailyProfit);

        const updateData = {
          lastProfitDate: today,
          daysCompleted: completedDays
        };

        if (completedDays >= Number(plan.duration)) {

          balance += Number(plan.price);
          updateData.status = "Completed";

          await addDoc(collection(db, "history"), {
            uid: user.uid,
            email: user.email,
            type: "Capital Return",
            amount: Number(plan.price),
            currency: "USDT",
            description: plan.planName + " Capital Returned",
            createdAt: serverTimestamp()
          });

        }

        await updateDoc(userRef, {
          balance: balance
        });

        await updateDoc(
          doc(db, "userPlans", planDoc.id),
          updateData
        );

        await addDoc(collection(db, "history"), {
          uid: user.uid,
          email: user.email,
          type: "Daily Profit",
          amount: Number(plan.dailyProfit),
          currency: "USDT",
          description: plan.planName + " Daily Profit",
          createdAt: serverTimestamp()
        });

      }

      activePlanBox.innerHTML += `
        <div class="card">
          <h3>${plan.planName}</h3>

          <p><b>Investment:</b> ${formatMoney(plan.price)}</p>

          <p><b>Daily Profit:</b> ${formatMoney(plan.dailyProfit)}</p>

          <p><b>Completed Days:</b> ${completedDays}</p>

          <p><b>Remaining:</b> ${Math.max(
            0,
            Number(plan.duration) - completedDays
          )} Days</p>

          <p><b>Status:</b> ${
            completedDays >= Number(plan.duration)
              ? "Completed"
              : plan.status
          }</p>
        </div><br>
      `;

    }

    if (plansSnap.empty) {
      activePlanBox.innerHTML = "<p>No Active Plan</p>";
    }

    balanceBox.textContent = formatMoney(balance);

    if (investmentBox)
      investmentBox.textContent = formatMoney(totalInvestment);

    if (todayProfitBox)
      todayProfitBox.textContent = "+" + formatMoney(todayProfit);
      } catch (error) {

    console.error(error);
    alert(error.message);

  }

});

// ===== Logout =====
logoutBtn?.addEventListener("click", async () => {

  try {

    await signOut(auth);
    window.location.href = "login.html";

  } catch (error) {

    console.error(error);
    alert(error.message);

  }

});

// ===== Dashboard Ready =====
window.addEventListener("DOMContentLoaded", () => {

  console.log("GrowVest Premium Dashboard Loaded");

});
