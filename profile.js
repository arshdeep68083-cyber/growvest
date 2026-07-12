import { auth, db } from "./firebase-config.js";

import {
  onAuthStateChanged
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

    document.getElementById("name").textContent =
      data.name || "N/A";

    document.getElementById("email").textContent =
      data.email || user.email;

    document.getElementById("balance").textContent =
      (Number(data.balance || 0)).toFixed(2) + " USDT";

    document.getElementById("joinDate").textContent =
      data.joinDate || data.joindate || "N/A";

    const plansSnap = await getDocs(
      query(
        collection(db, "userPlans"),
        where("uid", "==", user.uid),
        where("status", "==", "Active")
      )
    );

    let activePlans = document.getElementById("activePlans");

    if (!activePlans) {
      activePlans = document.createElement("p");
      activePlans.id = "activePlans";
      document.querySelector(".container").appendChild(activePlans);
    }

    activePlans.innerHTML =
      "<strong>Active Plans:</strong> " + plansSnap.size;

  } catch (error) {
    console.log(error);
    alert(error.message);
  }

});
