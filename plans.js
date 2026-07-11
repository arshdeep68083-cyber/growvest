import { auth, db } from "./firebase-config.js";

import {
  doc,
  getDoc,
  updateDoc,
  addDoc,
  collection,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const plans = {
  "Starter Plan": {
    price: 100,
    duration: 30,
    monthlyProfit: 5
  },
  "Silver Plan": {
    price: 500,
    duration: 30,
    monthlyProfit: 7
  },
  "Gold Plan": {
    price: 1000,
    duration: 30,
    monthlyProfit: 10
  },
  "Platinum Plan": {
    price: 5000,
    duration: 30,
    monthlyProfit: 15
  }
};

window.investSuccess = async function(planName){

  const user = auth.currentUser;

  if(!user){
    alert("Please login first.");
    return;
  }

  const userRef = doc(db,"users",user.uid);
  const snap = await getDoc(userRef);

  if(!snap.exists()){
    alert("User not found.");
    return;
  }

  const userData = snap.data();

  let balance = Number(userData.balance || 0);
  let investment = Number(userData.investment || 0);

  const plan = plans[planName];

  if(balance < plan.price){
    alert("❌ Insufficient Balance");
    return;
  }

  balance -= plan.price;
  investment += plan.price;

  const dailyProfit =
      (plan.price * (plan.monthlyProfit/100)) / 30;

  await updateDoc(userRef,{
    balance: balance,
    investment: investment
  });

  await addDoc(collection(db,"userPlans"),{
    uid:user.uid,
    email:user.email,
    planName:planName,
    price:plan.price,
    duration:plan.duration,
    dailyProfit:dailyProfit,
    monthlyProfit:plan.monthlyProfit,
    daysCompleted:0,
    status:"Active",
    createdAt:serverTimestamp()
  });

  alert("✅ Investment Successful!\n\nYour plan has been activated successfully.");

  location.href="dashboard.html";

}
