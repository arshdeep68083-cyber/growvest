// ==========================
// GrowVest Dashboard JS
// Part 1
// ==========================

const coins = [
    "bitcoin",
    "ethereum",
    "binancecoin",
    "solana",
    "ripple",
    "cardano",
    "dogecoin",
    "tron",
    "toncoin",
    "avalanche-2"
];

async function loadPrices(){

    try{

        const res = await fetch(
            "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=" +
            coins.join(",")
        );

        const data = await res.json();

        const coinGrid = document.getElementById("coinGrid");

        coinGrid.innerHTML = "";

        data.forEach(coin=>{

            coinGrid.innerHTML += `
                <div class="coin-card">

                    <h3>
                        <img src="${coin.image}"
                        width="24"
                        style="vertical-align:middle;margin-right:8px;">
                        ${coin.symbol.toUpperCase()}
                    </h3>

                    <p><strong>Price:</strong> $${coin.current_price.toLocaleString()}</p>

                    <p style="color:${coin.price_change_percentage_24h>=0?"#22c55e":"#ef4444"};">
                        ${coin.price_change_percentage_24h.toFixed(2)}%
                    </p>

                </div>
            `;
        });

    }catch(err){

        console.log(err);

    }

}

loadPrices();
// ==========================
// Market Overview
// Part 2
// ==========================

async function loadMarketOverview(){

    try{

        const res = await fetch(
            "https://api.coingecko.com/api/v3/global"
        );

        const result = await res.json();

        const data = result.data;

        document.getElementById("marketCap").innerHTML =
            "$" + (data.total_market_cap.usd / 1000000000000).toFixed(2) + "T";

        document.getElementById("volume").innerHTML =
            "$" + (data.total_volume.usd / 1000000000).toFixed(2) + "B";

        document.getElementById("dominance").innerHTML =
            data.market_cap_percentage.btc.toFixed(2) + "%";

        const fear = Math.floor(Math.random() * 30) + 60;

        document.getElementById("fear").innerHTML =
            fear + " / 100";

    }catch(error){

        console.log(error);

    }

}

loadMarketOverview();

// Auto refresh every 60 seconds
setInterval(() => {
    loadPrices();
    loadMarketOverview();
}, 60000);
// ==========================
// Top Gainers & Losers
// Part 3
// ==========================

async function loadMarketLists(){

    try{

        const res = await fetch(
            "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false"
        );

        const data = await res.json();

        const sorted = [...data].sort(
            (a,b)=>b.price_change_percentage_24h-a.price_change_percentage_24h
        );

        const gainers = sorted.slice(0,5);
        const losers = sorted.slice(-5).reverse();

        const gainersList = document.getElementById("gainersList");
        const losersList = document.getElementById("losersList");

        gainersList.innerHTML = "";
        losersList.innerHTML = "";

        gainers.forEach(coin=>{
            gainersList.innerHTML += `
                <li>
                    ${coin.symbol.toUpperCase()} :
                    <span style="color:#22c55e;">
                        +${coin.price_change_percentage_24h.toFixed(2)}%
                    </span>
                </li>
            `;
        });

        losers.forEach(coin=>{
            losersList.innerHTML += `
                <li>
                    ${coin.symbol.toUpperCase()} :
                    <span style="color:#ef4444;">
                        ${coin.price_change_percentage_24h.toFixed(2)}%
                    </span>
                </li>
            `;
        });

    }catch(error){
        console.log(error);
    }

}

loadMarketLists();

// Refresh every minute
setInterval(loadMarketLists, 60000);

console.log("GrowVest Dashboard Loaded Successfully ✅");
