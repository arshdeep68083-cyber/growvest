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
const joinDate = document.getElementById("joinDate");
const activePlans = document.getElementById("activePlans");
const logoutBtn = document.getElementById("logoutBtn");

onAuthStateChanged(auth, async (user) => {

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    try {

        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            alert("User data not found!");
            return;
        }

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
                data.joinDate ||
                data.joindate ||
                "Not Available";

        if (activePlans) {

            const plansQuery = query(
                collection(db, "userPlans"),
                where("uid", "==", user.uid),
                where("status", "==", "Active")
            );

            const plansSnap = await getDocs(plansQuery);

            activePlans.textContent = plansSnap.size;
        }

    } catch (error) {

        console.error(error);
        alert(error.message);

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

        } catch (error) {

            console.error(error);
            alert("Logout failed!");

        }

    });

}

console.log("✅ GrowVest Profile Loaded Successfully");
