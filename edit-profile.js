/* ==========================================
   EDIT-PROFILE.JS - FINAL
   PART 1
========================================== */

document.addEventListener("DOMContentLoaded", () => {

  // Default profile data
  const profileData = {
    fullName: "",
    email: "",
    phone: "",
    country: "",
    username: "",
    address: "",
    city: "",
    postalCode: ""
  };

  // Make data globally available
  window.profileData = profileData;

  // Populate form fields
  function setValue(id, value) {
    const element = document.getElementById(id);
    if (element) {
      element.value = value;
    }
  }

  setValue("fullName", profileData.fullName);
  setValue("email", profileData.email);
  setValue("phone", profileData.phone);
  setValue("country", profileData.country);
  setValue("username", profileData.username);
  setValue("address", profileData.address);
  setValue("city", profileData.city);
  setValue("postalCode", profileData.postalCode);

});
/* ==========================================
   EDIT-PROFILE.JS - FINAL
   PART 2
========================================== */

// Profile image preview

const profilePhotoInput = document.getElementById("profilePhoto");

if (profilePhotoInput) {

  profilePhotoInput.addEventListener("change", (event) => {

    const file = event.target.files[0];

    if (!file) return;

    console.log(`Selected image: ${file.name}`);

    // Future image preview can be added here.

  });

}

// Collect form data

function getProfileData() {

  return {

    fullName: document.getElementById("fullName")?.value.trim() || "",
    email: document.getElementById("email")?.value.trim() || "",
    phone: document.getElementById("phone")?.value.trim() || "",
    country: document.getElementById("country")?.value.trim() || "",
    username: document.getElementById("username")?.value.trim() || "",
    address: document.getElementById("address")?.value.trim() || "",
    city: document.getElementById("city")?.value.trim() || "",
    postalCode: document.getElementById("postalCode")?.value.trim() || ""

  };

}

// Basic validation

function validateProfile(data) {

  if (!data.fullName)
    return { valid: false, message: "Full name is required." };

  if (!data.email)
    return { valid: false, message: "Email is required." };

  return {
    valid: true,
    message: "Profile is valid."
  };

}
/* ==========================================
   EDIT-PROFILE.JS - FINAL
   PART 3
========================================== */

// Password validation

function validatePassword(currentPassword, newPassword, confirmPassword) {

  if (!newPassword && !confirmPassword) {
    return {
      valid: true,
      message: "No password change requested."
    };
  }

  if (!currentPassword) {
    return {
      valid: false,
      message: "Current password is required."
    };
  }

  if (newPassword.length < 8) {
    return {
      valid: false,
      message: "New password must be at least 8 characters."
    };
  }

  if (newPassword !== confirmPassword) {
    return {
      valid: false,
      message: "Passwords do not match."
    };
  }

  return {
    valid: true,
    message: "Password is valid."
  };

}

// Save profile

function saveProfile() {

  const profile = getProfileData();

  const validation = validateProfile(profile);

  if (!validation.valid) {
    alert(validation.message);
    return false;
  }

  const passwordCheck = validatePassword(
    document.getElementById("currentPassword")?.value || "",
    document.getElementById("newPassword")?.value || "",
    document.getElementById("confirmPassword")?.value || ""
  );

  if (!passwordCheck.valid) {
    alert(passwordCheck.message);
    return false;
  }

  console.log("Profile saved:", profile);

  alert("Profile updated successfully.");

  return true;

}
/* ==========================================
   EDIT-PROFILE.JS - FINAL
   PART 4 (FINAL)
========================================== */

// Initialize page

function initializeEditProfile() {

  console.log("Edit Profile page initialized.");

  const saveButton = document.getElementById("saveProfileBtn");

  if (saveButton) {

    saveButton.addEventListener("click", (event) => {

      event.preventDefault();

      saveProfile();

    });

  }

}

// Reset form (optional helper)

function resetProfileForm() {

  const form = document.querySelector("form");

  if (form) {
    form.reset();
  }

  console.log("Profile form reset.");

}

// Run when page loads

document.addEventListener("DOMContentLoaded", () => {

  initializeEditProfile();

});
