import { auth, db } from "./firebase-config.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const userName = document.getElementById("userName");
const userEmail = document.getElementById("userEmail");
const userEmail2 = document.getElementById("userEmail2");
const userBalance = document.getElementById("userBalance");
const userInvestment = document.getElementById("userInvestment");
const userEarnings = document.getElementById("userEarnings");
const userId = document.getElementById("userId");
const joinDate = document.getElementById("joinDate");

const referralLink = document.getElementById("referralLink");
const totalReferrals = document.getElementById("totalReferrals");
const referralBonus = document.getElementById("referralBonus");

const copyReferralBtn = document.getElementById("copyReferralBtn");
const logoutBtn = document.getElementById("logoutBtn");

onAuthStateChanged(auth, async (user) => {

  if (!user) {
    location.href = "login.html";
    return;
  }

  userEmail.textContent = user.email;
  userEmail2.textContent = user.email;
  userId.textContent = user.uid;

  referralLink.value =
    `${window.location.origin}/register.html?ref=${user.uid}`;

  const snap = await getDoc(doc(db, "users", user.uid));

  if (snap.exists()) {

    const data = snap.data();

    userName.textContent = data.name || "GrowVest User";
    userBalance.textContent = `${data.balance || 0} USDT`;
    userInvestment.textContent = `${data.investment || 0} USDT`;
    userEarnings.textContent = `${data.earnings || 0} USDT`;

    totalReferrals.textContent = data.referrals || 0;
    referralBonus.textContent =
      `${data.referralBonus || 0} USDT`;

    if (data.createdAt?.toDate) {
      joinDate.textContent =
        data.createdAt.toDate().toLocaleDateString();
    } else {
      joinDate.textContent = "N/A";
    }

  } else {

    userName.textContent = "GrowVest User";
    userBalance.textContent = "0 USDT";
    userInvestment.textContent = "0 USDT";
    userEarnings.textContent = "0 USDT";
    totalReferrals.textContent = "0";
    referralBonus.textContent = "0 USDT";
    joinDate.textContent = "N/A";

  }

});

copyReferralBtn.onclick = async () => {

  await navigator.clipboard.writeText(referralLink.value);

  copyReferralBtn.innerHTML =
    '<i class="fas fa-check"></i> Copied';

  setTimeout(() => {

    copyReferralBtn.innerHTML =
      '<i class="fas fa-copy"></i> Copy Invite Link';

  },2000);

};

logoutBtn.onclick = async () => {

  await signOut(auth);

  location.href = "login.html";

};
