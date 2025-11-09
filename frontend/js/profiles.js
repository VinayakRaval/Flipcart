// frontend/js/profiles.js
const API_UPDATE = "http://localhost/flipcart/backend/profile/update_users.php";

document.addEventListener("DOMContentLoaded", () => {
  const customer = JSON.parse(localStorage.getItem("customer") || "null");
  if (!customer) {
    // not logged in — redirect to login
    // you can change behavior if you allow profile view for guests
    window.location.href = "login.html";
    return;
  }

  // Populate fields
  document.getElementById("userId").value = customer.id || "";
  document.getElementById("name").value = customer.name || "";
  document.getElementById("email").value = customer.email || "";
  document.getElementById("phone").value = customer.mobile || "";
  document.getElementById("pincode").value = customer.pincode || "";
  document.getElementById("address").value = customer.address || "";

  const avatarPreview = document.getElementById("avatarPreview");
  if (customer.profile_image) {
    avatarPreview.src = `http://localhost/flipcart/backend/uploads/profiles/${customer.profile_image}`;
  }

  // Preview image when selected
  document.getElementById("profileImage").addEventListener("change", (e) => {
    const f = e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => (avatarPreview.src = reader.result);
    reader.readAsDataURL(f);
  });

  // Cancel button
  document.getElementById("cancelBtn").addEventListener("click", () => {
    window.location.href = "index.html";
  });

  // Form submit
  document.getElementById("profileForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const userId = document.getElementById("userId").value;
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const pincode = document.getElementById("pincode").value.trim();
    const address = document.getElementById("address").value.trim();
    const file = document.getElementById("profileImage").files[0];

    if (!name || !email) {
      alert("Name and email are required.");
      return;
    }

    const fd = new FormData();
    fd.append("id", userId);
    fd.append("name", name);
    fd.append("email", email);
    fd.append("mobile", phone);
    fd.append("pincode", pincode);
    fd.append("address", address);
    if (file) fd.append("profile_image", file);

    try {
      const res = await fetch(API_UPDATE, { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Update failed");

      // Save updated user back to localStorage
      if (data.user) {
        localStorage.setItem("customer", JSON.stringify(data.user));
      }
      alert(data.message || "Profile updated");
      // redirect to profile display or homepage
      window.location.href = "profiles.html";
    } catch (err) {
      console.error(err);
      alert("Network error — check XAMPP or backend logs");
    }
  });
});
