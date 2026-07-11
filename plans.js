import { db } from "./firebase-config.js";
import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const plansList = document.getElementById("plansList");

async function loadPlans() {

  try {

    const snapshot = await getDocs(collection(db, "plans"));

    let plans = [];

    snapshot.forEach((doc) => {
      plans.push(doc.data());
    });

    // Price de hisaab naal sort
    plans.sort((a, b) => a.price - b.price);

    plansList.innerHTML = "";

    plans.forEach((plan) => {
      plansList.innerHTML += `
        <div class="card">
          <h2>${plan.name}</h2>

          <p><b>Investment:</b> ₹${plan.price}</p>
          <p><b>Daily Profit:</b> ₹${plan.dailyProfit}</p>
          <p><b>Duration:</b> ${plan.duration} Days</p>
          <p><b>Status:</b> ${plan.status}</p>

          <button class="btn">Invest Now</button>
        </div>
        <br>
      `;
    });

  } catch (error) {
    alert(error.message);
  }

}

loadPlans();