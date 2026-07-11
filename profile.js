import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

alert("Profile JS Loaded");

onAuthStateChanged(auth, async (user) => {

  if (!user) {
    alert("Please login first!");
    window.location.href = "login.html";
    return;
  }

  alert("User UID: " + user.uid);

  try {

    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {

      const data = docSnap.data();

      document.getElementById("name").textContent = data.name || "N/A";
      document.getElementById("email").textContent = data.email || "N/A";
      document.getElementById("balance").textContent = "₹" + (data.balance || 0);
      document.getElementById("joinDate").textContent = data.joinDate || "N/A";

    } else {
      alert("User document not found!");
    }

  } catch (error) {
    alert("Firebase Error: " + error.message);
  }

});