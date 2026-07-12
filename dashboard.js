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

// ===== Format Balance =====

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

// ===== Check Login =====

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

  balanceBox.textContent = formatMoney(balance);

  try {

    const plansQuery = query(
      collection(db, "userPlans"),
      where("uid", "==", user.uid),
      where("status", "==", "Active")
    );

    const plansSnap = await getDocs(plansQuery);

    activePlanBox.innerHTML = "";
        if (plansSnap.empty) {

      activePlanBox.innerHTML = `
        <div class="plan-card-item">
          <h3>No Active Plan</h3>
          <p>You haven't purchased any investment plan yet.</p>
        </div>
      `;

    } else {

      const today = new Date().toISOString().split("T")[0];

      for (const planDoc of plansSnap.docs) {

        const plan = planDoc.data();

        let completedDays = Number(plan.daysCompleted || 0);

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

        balanceBox.textContent = formatMoney(balance);

        activePlanBox.innerHTML += `
          <div class="plan-card-item">
            <h3>${plan.planName}</h3>

            <div class="plan-row">
              <span>Investment</span>
              <strong>${formatMoney(plan.price)}</strong>
            </div>

            <div class="plan-row">
              <span>Daily Profit</span>
              <strong>${formatMoney(plan.dailyProfit)}</strong>
            </div>

            <div class="plan-row">
              <span>Completed</span>
              <strong>${completedDays}/${plan.duration} Days</strong>
            </div>
                        <div class="plan-row">
              <span>Remaining</span>
              <strong>${Math.max(
                0,
                Number(plan.duration) - completedDays
              )} Days</strong>
            </div>

            <div class="plan-status ${
              completedDays >= Number(plan.duration)
                ? "completed"
                : "active"
            }">
              ${
                completedDays >= Number(plan.duration)
                  ? "Completed"
                  : "Active"
              }
            </div>
          </div>
        `;

      }

    }

  } catch (error) {

    console.error(error);
    alert(error.message);

  }

});

// ===== Logout =====

logoutBtn.addEventListener("click", async () => {

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

  console.log("GrowVest Dashboard Loaded Successfully");

});
