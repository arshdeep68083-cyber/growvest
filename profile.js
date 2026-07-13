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

onAuthStateChanged(auth, async (user) => {

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  try {

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      alert("User profile not found!");
      return;
    }

    const data = userSnap.data();

    const nameEl = document.getElementById("name");
    const emailEl = document.getElementById("email");
    const balanceEl = document.getElementById("balance");
    const joinDateEl = document.getElementById("joinDate");

    if (nameEl) {
      nameEl.textContent = data.name || "N/A";
    }

    if (emailEl) {
      emailEl.textContent = data.email || user.email;
    }

    if (balanceEl) {
      balanceEl.textContent =
        (Number(data.balance || 0)).toFixed(2) + " USDT";
    }

    if (joinDateEl) {
      joinDateEl.textContent =
        data.joinDate || data.joindate || "N/A";
    }

    const plansQuery = query(
      collection(db, "userPlans"),
      where("uid", "==", user.uid),
      where("status", "==", "Active")
    );

    const plansSnap = await getDocs(plansQuery);
        let activePlans = document.getElementById("activePlans");

    if (!activePlans) {
      activePlans = document.createElement("p");
      activePlans.id = "activePlans";
      activePlans.style.marginTop = "15px";
      activePlans.style.textAlign = "center";
      activePlans.innerHTML = "<strong>Active Plans:</strong> 0";

      const profileCard = document.querySelector(".profile-card");
      if (profileCard) {
        profileCard.appendChild(activePlans);
      }
    }

    activePlans.innerHTML =
      "<strong>Active Plans:</strong> " + plansSnap.size;

  } catch (error) {
    console.error(error);
    alert(error.message);
  }
});

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    try {
      await signOut(auth);
      window.location.href = "login.html";
    } catch (error) {
      alert(error.message);
    }
  });
}

