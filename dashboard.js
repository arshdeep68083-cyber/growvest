/* ==========================================
   DASHBOARD.JS - FINAL
   PART 1
========================================== */

document.addEventListener("DOMContentLoaded", () => {

  // Demo dashboard data
  const dashboardData = {
    balance: 0,
    activeInvestment: 0,
    monthlyProfit: 0,
    totalDeposit: 0,
    totalWithdraw: 0,
    notifications: [
      "Welcome to GrowVest Pro!",
      "Your account is ready to use."
    ]
  };

  // Update dashboard cards
  const setText = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  };

  setText("totalBalance", `$${dashboardData.balance.toFixed(2)}`);
  setText("activeInvestment", `$${dashboardData.activeInvestment.toFixed(2)}`);
  setText("monthlyProfit", `$${dashboardData.monthlyProfit.toFixed(2)}`);
  setText("totalDeposit", `$${dashboardData.totalDeposit.toFixed(2)}`);
  setText("totalWithdraw", `$${dashboardData.totalWithdraw.toFixed(2)}`);

  // Store globally for next parts
  window.dashboardData = dashboardData;

});
/* ==========================================
   DASHBOARD.JS - FINAL
   PART 2
========================================== */

// Animate balance values

function animateValue(id, endValue, duration = 1000) {

  const element = document.getElementById(id);

  if (!element) return;

  let startValue = 0;
  const increment = endValue / (duration / 16);

  function update() {

    startValue += increment;

    if (startValue >= endValue) {
      element.textContent = `$${endValue.toFixed(2)}`;
      return;
    }

    element.textContent = `$${startValue.toFixed(2)}`;

    requestAnimationFrame(update);

  }

  update();

}

// Animate dashboard cards

animateValue("totalBalance", window.dashboardData.balance);
animateValue("activeInvestment", window.dashboardData.activeInvestment);
animateValue("monthlyProfit", window.dashboardData.monthlyProfit);
animateValue("totalDeposit", window.dashboardData.totalDeposit);
animateValue("totalWithdraw", window.dashboardData.totalWithdraw);

// Notifications

const notificationList =
document.getElementById("notificationList");

if (notificationList && window.dashboardData.notifications) {

  notificationList.innerHTML = "";

  window.dashboardData.notifications.forEach(text => {

    const item = document.createElement("div");

    item.className = "history-item";

    item.innerHTML = `
      <div>
        <h4>${text}</h4>
      </div>
    `;

    notificationList.appendChild(item);

  });

}
/* ==========================================
   DASHBOARD.JS - FINAL
   PART 3
========================================== */

// Recent Activity

const activityList = document.getElementById("recentActivity");

if (activityList) {

  const activities = [
    {
      title: "Deposit Completed",
      details: "$500.00 • Today"
    },
    {
      title: "Investment Activated",
      details: "$1000 Plan • Yesterday"
    },
    {
      title: "Withdrawal Requested",
      details: "$150.00 • Pending"
    }
  ];

  activityList.innerHTML = "";

  activities.forEach(activity => {

    const item = document.createElement("div");

    item.className = "history-item";

    item.innerHTML = `
      <div>
        <h4>${activity.title}</h4>
        <p>${activity.details}</p>
      </div>
    `;

    activityList.appendChild(item);

  });

}

// Helper function

function formatCurrency(amount) {
  return `$${Number(amount).toFixed(2)}`;
}

// Auto Refresh (every 60 seconds)

setInterval(() => {

  console.log("Refreshing dashboard data...");

  // Future API refresh can be added here.

}, 60000);
/* ==========================================
   DASHBOARD.JS - FINAL
   PART 4 (FINAL)
========================================== */

// Dashboard Initialization

function initializeDashboard() {

  console.log("Dashboard initialized successfully.");

  // Future initialization logic can be added here.

}

// Refresh dashboard values

function refreshDashboard() {

  if (!window.dashboardData) return;

  document.getElementById("totalBalance") &&
    (document.getElementById("totalBalance").textContent =
      formatCurrency(window.dashboardData.balance));

  document.getElementById("activeInvestment") &&
    (document.getElementById("activeInvestment").textContent =
      formatCurrency(window.dashboardData.activeInvestment));

  document.getElementById("monthlyProfit") &&
    (document.getElementById("monthlyProfit").textContent =
      formatCurrency(window.dashboardData.monthlyProfit));

  document.getElementById("totalDeposit") &&
    (document.getElementById("totalDeposit").textContent =
      formatCurrency(window.dashboardData.totalDeposit));

  document.getElementById("totalWithdraw") &&
    (document.getElementById("totalWithdraw").textContent =
      formatCurrency(window.dashboardData.totalWithdraw));

}

// Run on page load

document.addEventListener("DOMContentLoaded", () => {

  initializeDashboard();
  refreshDashboard();

});
