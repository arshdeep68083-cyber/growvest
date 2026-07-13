import { auth, db } from "./firebase-config.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
  doc,
  getDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const form = document.getElementById("editProfileForm");

const name = document.getElementById("name");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const country = document.getElementById("country");
const wallet = document.getElementById("wallet");

let currentUser = null;

onAuthStateChanged(auth, async (user) => {

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    currentUser = user;

    try {

        const userRef = doc(db, "users", user.uid);
        const snap = await getDoc(userRef);

        if (snap.exists()) {

            const data = snap.data();

            if (name) name.value = data.name || "";
            if (email) email.value = data.email || user.email;
            if (phone) phone.value = data.phone || "";
            if (country) country.value = data.country || "";
            if (wallet) wallet.value = data.wallet || "";

        }

    } catch (err) {

        console.error(err);

    }

});

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    try {

        await updateDoc(doc(db, "users", currentUser.uid), {

            name: name.value.trim(),
            phone: phone.value.trim(),
            country: country.value.trim(),
            wallet: wallet.value.trim()

        });

        alert("Profile updated successfully!");

        window.location.href = "profile.html";

    } catch (err) {

        console.error(err);
        alert(err.message);

    }

});
