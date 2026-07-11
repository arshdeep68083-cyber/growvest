import { auth, db, storage } from "./firebase-config.js";

import {
  doc,
  getDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import {
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-storage.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const profilePhoto = document.getElementById("profilePhoto");
const profileImageInput = document.getElementById("profileImageInput");
const editProfileBtn = document.getElementById("editProfileBtn");

const userName = document.getElementById("userName");
const userEmail = document.getElementById("userEmail");
const userEmail2 = document.getElementById("userEmail2");
const userBalance = document.getElementById("userBalance");
const userInvestment = document.getElementById("userInvestment");
const userEarnings = document.getElementById("userEarnings");
const userId = document.getElementById("userId");
const joinDate = document.getElementById("joinDate");

const referralLink = document.getElementById("referralLink");
const totalReferrals = document.getElementById("totalReferrals");
const referralBonus = document.getElementById("referralBonus");

const copyReferralBtn = document.getElementById("copyReferralBtn");
const logoutBtn = document.getElementById("logoutBtn");

let currentUser = null;

onAuthStateChanged(auth, async (user) => {

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  currentUser = user;

  userEmail.textContent = user.email;
  userEmail2.textContent = user.email;
  userId.textContent = user.uid;

  referralLink.value =
    `${window.location.origin}/register.html?ref=${user.uid}`;

  const snap = await getDoc(doc(db, "users", user.uid));

  if (snap.exists()) {

    const data = snap.data();

    userName.textContent = data.name || "GrowVest User";

    userBalance.textContent =
      `${Number(data.balance || 0).toFixed(2)} USDT`;

    userInvestment.textContent =
      `${Number(data.investment || 0).toFixed(2)} USDT`;

    userEarnings.textContent =
      `${Number(data.earnings || 0).toFixed(2)} USDT`;

    totalReferrals.textContent = data.referrals || 0;

    referralBonus.textContent =
      `${Number(data.referralBonus || 0).toFixed(2)} USDT`;

    if (data.photoURL) {
      profilePhoto.src = data.photoURL;
    }

    if (data.createdAt?.toDate) {
      joinDate.textContent =
        data.createdAt.toDate().toLocaleDateString();
    } else {
      joinDate.textContent = "N/A";
    }

  }

});
// =========================
// PROFILE.JS - PART 2
// Paste this below Part 1
// =========================

// Open gallery when Edit Profile button is clicked
editProfileBtn.addEventListener("click", () => {
  profileImageInput.click();
});

// Upload new profile image
profileImageInput.addEventListener("change", async (e) => {

  const file = e.target.files[0];

  if (!file || !currentUser) return;

  try {

    editProfileBtn.disabled = true;
    editProfileBtn.innerHTML =
      '<i class="fas fa-spinner fa-spin"></i> Uploading...';

    const imageRef = ref(
      storage,
      `profilePhotos/${currentUser.uid}`
    );

    await uploadBytes(imageRef, file);

    const photoURL = await getDownloadURL(imageRef);

    await updateDoc(
      doc(db, "users", currentUser.uid),
      {
        photoURL: photoURL
      }
    );

    profilePhoto.src = photoURL;

    alert("Profile photo updated successfully!");

  } catch (error) {

    console.error(error);
    alert("Failed to upload profile photo.");

  } finally {

    editProfileBtn.disabled = false;

    editProfileBtn.innerHTML =
      '<i class="fas fa-camera"></i> Edit Profile';

  }

});
// =========================
// PROFILE.JS - PART 3
// Paste this below Part 2
// =========================

// Copy Referral Link
copyReferralBtn.addEventListener("click", async () => {

  try {

    await navigator.clipboard.writeText(referralLink.value);

    copyReferralBtn.innerHTML =
      '<i class="fas fa-check"></i> Copied';

    setTimeout(() => {

      copyReferralBtn.innerHTML =
        '<i class="fas fa-copy"></i> Copy Invite Link';

    }, 2000);

  } catch (error) {

    alert("Copy failed.");

  }

});

// Logout
logoutBtn.addEventListener("click", async () => {

  try {

    await signOut(auth);

    window.location.href = "login.html";

  } catch (error) {

    console.error(error);

    alert("Logout failed.");

  }

});
