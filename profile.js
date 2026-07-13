import { auth, db } from "./firebase-config.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const userName = document.getElementById("userName");
const userEmail = document.getElementById("userEmail");
const balance = document.getElementById("balance");
const activePlans = document.getElementById("activePlans");
const joinDate = document.getElementById("joinDate");
const logoutBtn = document.getElementById("logoutBtn");

onAuthStateChanged(auth, async (user) => {

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    try {

        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {

            const data = userSnap.data();

            if (userName)
                userName.textContent = data.name || "GrowVest User";

            if (userEmail)
                userEmail.textContent = data.email || user.email;

            if (balance)
                balance.textContent =
                    Number(data.balance || 0).toFixed(2) + " USDT";

            if (joinDate)
                joinDate.textContent =
                    data.joinDate || "Not Available";

        }

        if (activePlans) {

            const q = query(
                collection(db, "userPlans"),
                where("uid", "==", user.uid),
                where("status", "==", "Active")
            );

            const snap = await getDocs(q);

            activePlans.textContent = snap.size;

        }

    } catch (err) {

        console.error(err);
        alert(err.message);

    }

});
// ==========================
// Logout
// ==========================

if (logoutBtn) {

    logoutBtn.addEventListener("click", async () => {

        const ok = confirm("Are you sure you want to logout?");

        if (!ok) return;

        try {

            await signOut(auth);

            window.location.href = "login.html";

        } catch (err) {

            console.error(err);
            alert("Logout failed. Please try again.");

        }

    });

}

console.log("✅ Premium Profile Loaded Successfully");
