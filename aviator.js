const multiplierEl = document.getElementById("multiplier");
const statusEl = document.getElementById("status");
const betBtn = document.getElementById("betBtn");
const cashoutBtn = document.getElementById("cashoutBtn");

let multiplier = 1.00;
let gameRunning = false;
let interval;

function startGame() {
    multiplier = 1.00;
    gameRunning = true;

    statusEl.innerText = "Game Started";
    multiplierEl.style.color = "#22c55e";

    interval = setInterval(() => {
        multiplier += 0.02;
        multiplierEl.innerText = multiplier.toFixed(2) + "x";

        if (multiplier >= 5.00) {
            crashGame();
        }
    }, 100);
}

function crashGame() {
    clearInterval(interval);
    gameRunning = false;

    multiplierEl.style.color = "#ef4444";
    statusEl.innerText = "Crashed at " + multiplier.toFixed(2) + "x";

    setTimeout(() => {
        startGame();
    }, 5000);
}

betBtn.onclick = () => {
    if (!gameRunning) {
        alert("Wait for next round.");
        return;
    }

    alert("Bet Placed!");
};

cashoutBtn.onclick = () => {
    if (!gameRunning) {
        alert("Round Finished.");
        return;
    }

    alert("Cash Out at " + multiplier.toFixed(2) + "x");
};

startGame();
