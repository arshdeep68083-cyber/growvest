// =========================================
// GROWVEST PRO
// dashboard.js
// PART 1
// =========================================

import { auth, db } from "./firebase-config.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// ----------------------------
// USER DATA
// ----------------------------

let currentUser = null;

onAuthStateChanged(auth, async (user) => {

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    currentUser = user;

    loadUserProfile(user);

});

// ----------------------------
// LOAD USER PROFILE
// ----------------------------

async function loadUserProfile(user){

    try{

        const snap = await getDoc(
            doc(db,"users",user.uid)
        );

        if(!snap.exists()) return;

        const data = snap.data();

        setValue("userName",data.name || "User");
        setValue("balance",money(data.balance));
        setValue("deposit",money(data.deposit || 0));
        setValue("withdraw",money(data.withdraw || 0));
        setValue("profit",money(data.profit || 0));

    }catch(err){

        console.error(err);

    }

}

// ----------------------------
// HELPERS
// ----------------------------

function setValue(id,value){

    const el=document.getElementById(id);

    if(el){

        el.textContent=value;

    }

}

function money(amount){

    return "$"+Number(amount||0).toLocaleString(
        "en-US",
        {
            minimumFractionDigits:2,
            maximumFractionDigits:2
        }
    );

}
// =========================================
// GROWVEST PRO
// dashboard.js
// PART 2
// LIVE CRYPTO MARKET
// =========================================

// ----------------------------
// LIVE CRYPTO PRICE
// ----------------------------

async function loadCryptoPrices(){

    try{

        const response = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,binancecoin,solana&vs_currencies=usd&include_24hr_change=true"
        );

        const data = await response.json();

        updateCoin(
            "btcPrice",
            data.bitcoin.usd,
            data.bitcoin.usd_24h_change
        );

        updateCoin(
            "ethPrice",
            data.ethereum.usd,
            data.ethereum.usd_24h_change
        );

        updateCoin(
            "bnbPrice",
            data.binancecoin.usd,
            data.binancecoin.usd_24h_change
        );

        updateCoin(
            "solPrice",
            data.solana.usd,
            data.solana.usd_24h_change
        );

    }catch(error){

        console.log("Crypto API Error",error);

    }

}

// ----------------------------
// UPDATE COIN
// ----------------------------

function updateCoin(id,price,change){

    const coin=document.getElementById(id);

    if(!coin) return;

    coin.innerHTML=
    "$"+Number(price).toLocaleString("en-US",{

        minimumFractionDigits:2,
        maximumFractionDigits:2

    });

    if(change>=0){

        coin.style.color="#22c55e";

    }else{

        coin.style.color="#ef4444";

    }

}

// ----------------------------
// AUTO REFRESH
// ----------------------------

loadCryptoPrices();

setInterval(loadCryptoPrices,15000);

// ----------------------------
// MARKET STATUS
// ----------------------------

function updateMarketTime(){

    const time=document.getElementById("marketTime");

    if(!time) return;

    time.innerHTML=
    "Updated : "+new Date().toLocaleTimeString();

}

updateMarketTime();

setInterval(updateMarketTime,1000);
// =========================================
// GROWVEST PRO
// dashboard.js
// PART 3
// TRADINGVIEW + INVITE SYSTEM
// =========================================

// ----------------------------
// LIVE TRADINGVIEW CHART
// ----------------------------

function loadTradingChart(){

    if(typeof TradingView==="undefined") return;

    new TradingView.widget({

        "autosize":true,

        "symbol":"BINANCE:BTCUSDT",

        "interval":"15",

        "timezone":"Etc/UTC",

        "theme":"dark",

        "style":"1",

        "locale":"en",

        "toolbar_bg":"#111827",

        "enable_publishing":false,

        "hide_side_toolbar":false,

        "allow_symbol_change":true,

        "container_id":"tradingview_chart"

    });

}

window.addEventListener("load",loadTradingChart);

// ----------------------------
// REFERRAL LINK
// ----------------------------

function generateInviteLink(){

    if(!currentUser) return;

    const invite =
    window.location.origin +
    "/register.html?ref=" +
    currentUser.uid;

    const input =
    document.getElementById("inviteLink");

    if(input){

        input.value = invite;

    }

}

window.addEventListener("load",generateInviteLink);

// ----------------------------
// COPY BUTTON
// ----------------------------

const copyBtn =
document.getElementById("copyInvite");

if(copyBtn){

copyBtn.addEventListener("click",async()=>{

    const input =
    document.getElementById("inviteLink");

    if(!input) return;

    await navigator.clipboard.writeText(input.value);

    copyBtn.innerHTML =
    '<i class="fa-solid fa-check"></i> Copied';

    setTimeout(()=>{

        copyBtn.innerHTML =
        '<i class="fa-solid fa-copy"></i> Copy Link';

    },2000);

});

}

// ----------------------------
// SHARE BUTTON
// ----------------------------

const shareBtn =
document.getElementById("shareInvite");

if(shareBtn){

shareBtn.addEventListener("click",async()=>{

    const input =
    document.getElementById("inviteLink");

    if(!input) return;

    if(navigator.share){

        await navigator.share({

            title:"GrowVest Pro",

            text:"Join GrowVest using my referral link.",

            url:input.value

        });

    }else{

        navigator.clipboard.writeText(input.value);

        alert("Referral link copied.");

    }

});

}

// ----------------------------
// PAGE ANIMATION
// ----------------------------

document.body.classList.add("loaded");

console.log("✅ Dashboard Ready");
// =========================================
// GROWVEST PRO
// dashboard.js
// PART 4 (FINAL)
// =========================================

// ----------------------------
// LOGOUT
// ----------------------------

import {
    signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const logoutBtn=document.getElementById("logoutBtn");

if(logoutBtn){

logoutBtn.addEventListener("click",async()=>{

try{

logoutBtn.disabled=true;

logoutBtn.innerHTML=
'<i class="fa-solid fa-spinner fa-spin"></i> Signing Out';

await signOut(auth);

window.location.href="login.html";

}catch(err){

alert(err.message);

logoutBtn.disabled=false;

logoutBtn.innerHTML=
'<i class="fa-solid fa-right-from-bracket"></i> Logout';

}

});

}

// ----------------------------
// AUTO REFRESH USER DATA
// ----------------------------

async function refreshDashboard(){

if(!currentUser) return;

try{

const snap=await getDoc(
doc(db,"users",currentUser.uid)
);

if(!snap.exists()) return;

const data=snap.data();

setValue("balance",money(data.balance||0));
setValue("deposit",money(data.deposit||0));
setValue("withdraw",money(data.withdraw||0));
setValue("profit",money(data.profit||0));

}catch(err){

console.log(err);

}

}

setInterval(refreshDashboard,30000);

// ----------------------------
// NOTIFICATIONS
// ----------------------------

function showNotification(message){

const box=document.createElement("div");

box.className="toast";

box.innerHTML=`
<i class="fa-solid fa-circle-check"></i>
${message}
`;

document.body.appendChild(box);

setTimeout(()=>{

box.classList.add("show");

},100);

setTimeout(()=>{

box.classList.remove("show");

setTimeout(()=>{

box.remove();

},500);

},3000);

}

// ----------------------------
// NETWORK STATUS
// ----------------------------

window.addEventListener("online",()=>{

showNotification("Internet Connected");

});

window.addEventListener("offline",()=>{

showNotification("No Internet Connection");

});

// ----------------------------
// LOADER
// ----------------------------

window.addEventListener("load",()=>{

const loader=document.getElementById("loader");

if(loader){

loader.style.opacity="0";

setTimeout(()=>{

loader.remove();

},500);

}

});

// ----------------------------
// DASHBOARD START
// ----------------------------

refreshDashboard();

console.log("🚀 GrowVest Pro Dashboard Loaded Successfully");
