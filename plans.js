import { auth, db } from "./firebase-config.js";

import {
  doc,
  getDoc,
  updateDoc,
  addDoc,
  collection,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

window.investPlan = async function(planName, price, duration, monthlyProfit){

  const user = auth.currentUser;

  if (!user) {
    alert("Please login first.");
    return;
  }

  try {

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      alert("User not found.");
      return;
    }

    const userData = userSnap.data();

    let balance = Number(userData.balance || 0);
    let investment = Number(userData.investment || 0);

    // Balance Check
    if (balance < price) {
      alert("❌ Insufficient Balance");
      return;
    }

    // Deduct Balance
    balance -= price;
    investment += price;

    const dailyProfit = (price * (monthlyProfit / 100)) / 30;

    // Update User Balance
    await updateDoc(userRef, {
      balance: balance,
      investment: investment
    });

    // Save Investment
    await addDoc(collection(db, "userPlans"), {
      uid: user.uid,
      email: user.email,
      planName: planName,
      price: price,
      duration: duration,
      monthlyProfit: monthlyProfit,
      dailyProfit: dailyProfit,
      daysCompleted: 0,
      lastProfitDate: "",
      status: "Active",
      createdAt: serverTimestamp()
    });

    // Save History
    await addDoc(collection(db, "history"), {
      uid: user.uid,
      email: user.email,
      type: "Investment",
      amount: price,
      currency: "USDT",
      description: planName + " Activated",
      createdAt: serverTimestamp()
    });

    alert("✅ Investment Successful!\n\nYour plan has been activated successfully.");

    window.location.href = "dashboard.html";

  } catch (error) {
    console.error(error);
    alert(error.message);
  }
}
