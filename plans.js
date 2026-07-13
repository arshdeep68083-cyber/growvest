/* ==========================================
   PLANS.JS - FINAL
   PART 1
========================================== */

document.addEventListener("DOMContentLoaded", () => {

  // Available investment plans
  const plans = [
    {
      id: "starter",
      name: "Starter Plan",
      min: 100,
      max: 499,
      monthlyReturn: 5
    },
    {
      id: "silver",
      name: "Silver Plan",
      min: 500,
      max: 999,
      monthlyReturn: 7
    },
    {
      id: "gold",
      name: "Gold Plan",
      min: 1000,
      max: 4999,
      monthlyReturn: 10
    },
    {
      id: "platinum",
      name: "Platinum Plan",
      min: 5000,
      max: 9999,
      monthlyReturn: 15
    }
  ];

  // Make plans available globally
  window.investmentPlans = plans;

  console.log("Investment plans loaded.");

});
/* ==========================================
   PLANS.JS - FINAL
   PART 2
========================================== */

// Calculate monthly profit

function calculateMonthlyProfit(amount, rate) {
  return (amount * rate) / 100;
}

// Validate investment amount

function validateInvestment(amount, plan) {

  if (!plan) {
    return {
      valid: false,
      message: "Invalid plan selected."
    };
  }

  if (amount < plan.min) {
    return {
      valid: false,
      message: `Minimum investment is $${plan.min}.`
    };
  }

  if (amount > plan.max) {
    return {
      valid: false,
      message: `Maximum investment is $${plan.max}.`
    };
  }

  return {
    valid: true,
    message: "Investment amount is valid."
  };

}

// Get plan by ID

function getPlanById(planId) {
  return window.investmentPlans.find(plan => plan.id === planId);
}

// Create investment summary

function getInvestmentSummary(planId, amount) {

  const plan = getPlanById(planId);

  if (!plan) return null;

  return {
    planName: plan.name,
    investment: amount,
    monthlyProfit: calculateMonthlyProfit(amount, plan.monthlyReturn),
    monthlyReturn: plan.monthlyReturn
  };

}
/* ==========================================
   PLANS.JS - FINAL
   PART 3
========================================== */

// Display investment preview

function showInvestmentPreview(planId, amount) {

  const summary = getInvestmentSummary(planId, amount);

  if (!summary) return;

  const preview = document.getElementById("investmentPreview");

  if (!preview) return;

  preview.innerHTML = `
    <div class="summary-item">
      <span>Plan</span>
      <strong>${summary.planName}</strong>
    </div>

    <div class="summary-item">
      <span>Investment</span>
      <strong>$${summary.investment.toFixed(2)}</strong>
    </div>

    <div class="summary-item">
      <span>Monthly Return</span>
      <strong>${summary.monthlyReturn}%</strong>
    </div>

    <div class="summary-item">
      <span>Estimated Monthly Profit</span>
      <strong>$${summary.monthlyProfit.toFixed(2)}</strong>
    </div>
  `;
}

// Handle plan selection

function selectPlan(planId, amount) {

  const plan = getPlanById(planId);

  const validation = validateInvestment(amount, plan);

  if (!validation.valid) {
    alert(validation.message);
    return false;
  }

  showInvestmentPreview(planId, amount);

  console.log(`Selected ${plan.name}`);

  return true;
}

// Clear preview

function clearInvestmentPreview() {

  const preview = document.getElementById("investmentPreview");

  if (preview) {
    preview.innerHTML = "";
  }

}
/* ==========================================
   PLANS.JS - FINAL
   PART 4 (FINAL)
========================================== */

// Initialize plans page

function initializePlans() {

  console.log("Plans page initialized.");

  // Future setup logic can be added here.

}

// Attach event listeners

document.addEventListener("DOMContentLoaded", () => {

  initializePlans();

  const planButtons = document.querySelectorAll(".btn-primary");

  planButtons.forEach((button) => {

    button.addEventListener("click", () => {

      console.log("Plan button clicked.");

      // Future investment flow can be added here.

    });

  });

});

// Utility function

function resetSelection() {

  clearInvestmentPreview();

  console.log("Selection reset.");

}
