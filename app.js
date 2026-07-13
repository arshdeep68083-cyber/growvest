// ======================================================
// GROWVEST PRO
// app.js - PART 1
// Firebase Auth + User Initialization
// ======================================================

import { auth, db } from "./firebase-config.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// =====================
// ELEMENTS
// =====================

const userName = document.getElementById("userName");
const balance = document.getElementById("balance");

const depositAmount = document.getElementById("depositAmount");
const withdrawAmount = document.getElementById("withdrawAmount");
const profitAmount = document.getElementById("profitAmount");
const activePlans = document.getElementById("activePlans");

const totalInvestment = document.getElementById("totalInvestment");
const monthlyProfit = document.getElementById("monthlyProfit");

const referralCount = document.getElementById("referralCount");
const referralIncome = document.getElementById("referralIncome");

const referralCode = document.getElementById("referralCode");
const referralLink = document.getElementById("referralLink");

// =====================
// AUTH STATE
// =====================

onAuthStateChanged(auth, async (user) => {

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  try {

    const ref = doc(db, "users", user.uid);
    const snap = await getDoc(ref);

    if (!snap.exists()) return;

    const data = snap.data();

    // Welcome
    if (userName) {
      userName.textContent =
        data.name || user.email;
    }

    // Balance
    if (balance) {
      balance.textContent =
        "₹" + Number(data.balance || 0).toLocaleString("en-IN", {
          minimumFractionDigits: 2
        });
    }

    // Stats
    if (depositAmount)
      depositAmount.textContent =
        "₹" + Number(data.totalDeposit || 0).toLocaleString();

    if (withdrawAmount)
      withdrawAmount.textContent =
        "₹" + Number(data.totalWithdraw || 0).toLocaleString();

    if (profitAmount)
      profitAmount.textContent =
        "₹" + Number(data.totalProfit || 0).toLocaleString();

    if (activePlans)
      activePlans.textContent =
        data.activePlans || 0;

    if (totalInvestment)
      totalInvestment.textContent =
        "$" + Number(data.totalInvestment || 0);

    if (monthlyProfit)
      monthlyProfit.textContent =
        "$" + Number(data.monthlyProfit || 0);

    // Referral
    const code =
      data.referralCode || user.uid.substring(0, 8).toUpperCase();

    if (referralCode)
      referralCode.textContent = code;

    if (referralLink)
      referralLink.value =
        window.location.origin +
        "/register.html?ref=" +
        code;

    if (referralCount)
      referralCount.textContent =
        data.totalReferrals || 0;

    if (referralIncome)
      referralIncome.textContent =
        "$" + Number(data.referralIncome || 0);

  } catch (err) {

    console.error(err);

  }

});
// ======================================================
// app.js - PART 2
// Referral + Transactions + Logout
// ======================================================

// =====================
// COPY REFERRAL LINK
// =====================

const copyBtn = document.getElementById("copyReferralBtn");

if (copyBtn) {

  copyBtn.addEventListener("click", async () => {

    try {

      await navigator.clipboard.writeText(referralLink.value);

      alert("Referral link copied successfully.");

    } catch (err) {

      referralLink.select();
      document.execCommand("copy");

      alert("Referral link copied.");

    }

  });

}

// =====================
// SHARE REFERRAL
// =====================

const shareBtn = document.getElementById("shareReferralBtn");

if (shareBtn) {

  shareBtn.addEventListener("click", async () => {

    const url = referralLink.value;

    if (navigator.share) {

      try {

        await navigator.share({

          title: "GrowVest Pro",

          text: "Join GrowVest Pro using my referral link.",

          url

        });

      } catch (e) {}

    } else {

      window.open(
        "https://wa.me/?text=" +
        encodeURIComponent(url),
        "_blank"
      );

    }

  });

}

// =====================
// RECENT TRANSACTIONS
// =====================

const transactionBox =
document.getElementById("recentTransactions");

function createTransaction(title, date, amount, type) {

  return `

<div class="history-card">

<div class="history-left">

<div class="history-icon">
<i class="fa-solid fa-money-bill-wave"></i>
</div>

<div>

<div class="history-title">${title}</div>

<div class="history-date">${date}</div>

</div>

</div>

<div class="${type === "credit"
? "amount-plus"
: "amount-minus"}">

${type === "credit" ? "+" : "-"}₹${amount}

</div>

</div>

`;

}

if (transactionBox &&
transactionBox.children.length === 0) {

  transactionBox.innerHTML =
    createTransaction(

      "Welcome",

      new Date().toLocaleDateString(),

      0,

      "credit"

    );

}

// =====================
// LOGOUT
// =====================

const logoutBtn =
document.getElementById("logoutBtn");

if (logoutBtn) {

  logoutBtn.addEventListener("click", async () => {

    try {

      await signOut(auth);

      window.location.href = "login.html";

    } catch (err) {

      alert(err.message);

    }

  });

}
// ======================================================
// app.js - PART 3
// Helpers + Live Clock + Dashboard UI
// ======================================================

// =====================
// FORMAT CURRENCY
// =====================

function formatCurrency(value) {

  return "₹" + Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

}

// =====================
// SHOW TOAST
// =====================

function showToast(message) {

  const toast = document.createElement("div");

  toast.className = "toast";

  toast.textContent = message;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);

}

// =====================
// LIVE DATE & TIME
// =====================

const liveTime = document.getElementById("liveTime");

if (liveTime) {

  setInterval(() => {

    liveTime.textContent =
      new Date().toLocaleString();

  }, 1000);

}

// =====================
// BUTTON LOADING
// =====================

document.querySelectorAll(".btn").forEach(btn => {

  btn.addEventListener("click", () => {

    if (btn.dataset.loading === "true") return;

    btn.dataset.loading = "true";

    const oldText = btn.innerHTML;

    btn.innerHTML =
      '<i class="fa-solid fa-spinner fa-spin"></i> Please wait';

    setTimeout(() => {

      btn.innerHTML = oldText;

      btn.dataset.loading = "false";

    }, 1200);

  });

});

// =====================
// ONLINE STATUS
// =====================

window.addEventListener("online", () => {

  showToast("✅ Internet Connected");

});

window.addEventListener("offline", () => {

  showToast("⚠️ Internet Disconnected");

});

// =====================
// PAGE READY
// =====================

window.addEventListener("DOMContentLoaded", () => {

  console.log("GrowVest Pro Dashboard Ready");

});
// ======================================================
// app.js - PART 4 (FINAL)
// Auto Refresh + Theme + Utilities
// ======================================================

// =====================
// AUTO REFRESH DATA
// =====================

let refreshTimer = null;

function startAutoRefresh() {
  if (refreshTimer) clearInterval(refreshTimer);

  refreshTimer = setInterval(() => {
    console.log("Refreshing dashboard data...");
    // Future: reload Firestore data here
  }, 60000);
}

startAutoRefresh();

// =====================
// THEME
// =====================

const savedTheme = localStorage.getItem("theme");

if (savedTheme) {
  document.body.setAttribute("data-theme", savedTheme);
}

// =====================
// SAFE TEXT UPDATE
// =====================

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

// =====================
// SAFE VALUE UPDATE
// =====================

function setValue(id, value) {
  const el = document.getElementById(id);
  if (el) el.value = value;
}

// =====================
// PAGE INIT
// =====================

function initializeDashboard() {
  console.log("Dashboard initialized successfully");
}

initializeDashboard();

// =====================
// CLEANUP
// =====================

window.addEventListener("beforeunload", () => {
  if (refreshTimer) {
    clearInterval(refreshTimer);
  }
});
