// ======================================================
// GROWVEST PRO
// trading.js - PART 1
// Live Market Initialization
// ======================================================

const API =
"https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,binancecoin,ripple,dogecoin&vs_currencies=usd&include_24hr_change=true";

const btcPrice =
document.getElementById("btcPrice");

const ethPrice =
document.getElementById("ethPrice");

const btcLivePrice =
document.getElementById("btcLivePrice");

const ethLivePrice =
document.getElementById("ethLivePrice");

const btcChange =
document.getElementById("btcChange");

const ethChange =
document.getElementById("ethChange");

const marketCap =
document.getElementById("marketCap");

const marketChange =
document.getElementById("marketChange");

// ======================
// LOAD MARKET DATA
// ======================

async function loadMarket() {

  try {

    const res = await fetch(API);

    const data = await res.json();

    btcPrice.textContent =
      "$" + data.bitcoin.usd.toLocaleString();

    ethPrice.textContent =
      "$" + data.ethereum.usd.toLocaleString();

    btcLivePrice.textContent =
      "$" + data.bitcoin.usd.toLocaleString();

    ethLivePrice.textContent =
      "$" + data.ethereum.usd.toLocaleString();

    btcChange.textContent =
      data.bitcoin.usd_24h_change.toFixed(2) + "%";

    ethChange.textContent =
      data.ethereum.usd_24h_change.toFixed(2) + "%";

    marketCap.textContent =
      "$ Crypto";

    const avg =
      (
        data.bitcoin.usd_24h_change +
        data.ethereum.usd_24h_change
      ) / 2;

    marketChange.textContent =
      avg.toFixed(2) + "%";

  } catch (err) {

    console.error("Market error:", err);

  }

}

loadMarket();
// ======================================================
// trading.js - PART 2
// Auto Refresh + Search + Watchlist
// ======================================================

// ======================
// AUTO REFRESH
// ======================

setInterval(() => {
  loadMarket();
}, 30000);

// ======================
// COIN SEARCH
// ======================

const coinSearch =
document.getElementById("coinSearch");

if (coinSearch) {

  coinSearch.addEventListener("input", () => {

    const value =
      coinSearch.value.trim().toUpperCase();

    if (value === "BTC") {

      document
        .getElementById("tradingview_chart")
        .scrollIntoView({
          behavior: "smooth"
        });

    }

  });

}

// ======================
// WATCHLIST
// ======================

const watchlist = [
  "BTC",
  "ETH",
  "SOL",
  "BNB",
  "XRP"
];

console.log("Watchlist:", watchlist);

// ======================
// UPDATE COLORS
// ======================

function updateChangeColor(el, value) {

  if (!el) return;

  if (value >= 0) {

    el.classList.remove("amount-minus");
    el.classList.add("amount-plus");

  } else {

    el.classList.remove("amount-plus");
    el.classList.add("amount-minus");

  }

}

// ======================
// REFRESH UI
// ======================

async function refreshMarketUI() {

  await loadMarket();

  const btc =
    parseFloat(
      btcChange.textContent
    );

  const eth =
    parseFloat(
      ethChange.textContent
    );

  updateChangeColor(
    btcChange,
    btc
  );

  updateChangeColor(
    ethChange,
    eth
  );

}

refreshMarketUI();
// ======================================================
// trading.js - PART 3
// Buy/Sell UI + Notifications + Portfolio
// ======================================================

// ======================
// ELEMENTS
// ======================

const buyBtn = document.querySelector(".btn-green");
const sellBtn = document.querySelector(".btn-red");
const tradeCoin = document.getElementById("tradeCoin");
const tradeAmount = document.getElementById("tradeAmount");

const todayTrades =
document.getElementById("todayTrades");

const tradeProfit =
document.getElementById("tradeProfit");

// ======================
// TOAST
// ======================

function showToast(message) {

  const toast = document.createElement("div");

  toast.className = "toast";

  toast.innerText = message;

  document.body.appendChild(toast);

  setTimeout(() => {

    toast.remove();

  }, 3000);

}

// ======================
// BUY
// ======================

if (buyBtn) {

  buyBtn.addEventListener("click", () => {

    const coin = tradeCoin.value;
    const amount = Number(tradeAmount.value);

    if (!amount || amount <= 0) {
      showToast("Enter a valid amount.");
      return;
    }

    showToast(`Buy order created for ${coin}`);

    todayTrades.textContent =
      Number(todayTrades.textContent) + 1;

  });

}

// ======================
// SELL
// ======================

if (sellBtn) {

  sellBtn.addEventListener("click", () => {

    const coin = tradeCoin.value;
    const amount = Number(tradeAmount.value);

    if (!amount || amount <= 0) {
      showToast("Enter a valid amount.");
      return;
    }

    showToast(`Sell order created for ${coin}`);

    todayTrades.textContent =
      Number(todayTrades.textContent) + 1;

  });

}

// ======================
// DEMO P/L DISPLAY
// ======================

let pnl = 0;

setInterval(() => {

  pnl += (Math.random() * 10 - 5);

  if (tradeProfit) {

    tradeProfit.textContent =
      "$" + pnl.toFixed(2);

    if (pnl >= 0) {

      tradeProfit.style.color = "#16c784";

    } else {

      tradeProfit.style.color = "#ea3943";

    }

  }

}, 5000);
// ======================================================
// trading.js - PART 4 (FINAL)
// Auto Refresh + Helpers + Cleanup
// ======================================================

// ======================
// LAST UPDATED
// ======================

function updateLastRefresh() {
  const el = document.getElementById("lastUpdated");
  if (el) {
    el.textContent =
      "Updated: " + new Date().toLocaleTimeString();
  }
}

updateLastRefresh();

// ======================
// REFRESH LOOP
// ======================

let marketRefresh = setInterval(async () => {
  await refreshMarketUI();
  updateLastRefresh();
}, 30000);

// ======================
// FORMAT NUMBER
// ======================

function formatUSD(value) {
  return "$" + Number(value).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

// ======================
// CONNECTION STATUS
// ======================

window.addEventListener("online", () => {
  showToast("Internet Connected");
});

window.addEventListener("offline", () => {
  showToast("Internet Disconnected");
});

// ======================
// PAGE READY
// ======================

window.addEventListener("DOMContentLoaded", () => {
  console.log("Trading page loaded successfully");
});

// ======================
// CLEANUP
// ======================

window.addEventListener("beforeunload", () => {
  if (marketRefresh) {
    clearInterval(marketRefresh);
  }
});
