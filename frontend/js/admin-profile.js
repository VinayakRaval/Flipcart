/**
 * Flipcart Admin Profile (Final)
 * Updates admin details and syncs localStorage.
 */

const API_UPDATE_ADMIN = "http://localhost/flipcart/backend/admin/update_admin.php";
const IMG_PATH = "http://localhost/flipcart/backend/uploads/admins/";

document.addEventListener("DOMContentLoaded", () => {
  const admin = JSON.parse(localStorage.getItem("customer") || "null");

  if (!admin) {
    alert("Please log in as admin first!");
    window.location.href = "admin-login.html";
    return;
  }

  // Fill UI
  document.getElementById("name").value = admin.name || "";
  document.getElementById("email").value = admin.email || "";
  document.getElementById("adminNameTitle").textContent = admin.name || "Admin";
  document.getElementById("adminEmail").textContent = admin.email || "";

  if (admin.profile_image) {
    document.getElementById("adminPhoto").src = IMG_PATH + admin.profile_image;
  }

  // Logout
  document.getElementById("logoutBtn").addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("customer");
    window.location.href = "login.html";
  });

  // ✅ Back Button fix (no redirect to index)
  document.getElementById("backBtn").addEventListener("click", () => {
    window.location.href = "admin-dashboard.html";
  });

  // ✅ Update Profile
  document.getElementById("adminProfileForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append("id", admin.id);
    fd.append("name", document.getElementById("name").value.trim());
    const file = document.getElementById("profile_image").files[0];
    if (file) fd.append("profile_image", file);

    try {
      const res = await fetch(API_UPDATE_ADMIN, { method: "POST", body: fd });
      const data = await res.json();

      if (!data.success) {
        alert(data.error || "Profile update failed");
        return;
      }

      // ✅ Sync new admin info to localStorage
      const updated = { ...admin, ...data.admin };
      localStorage.setItem("customer", JSON.stringify(updated));

      alert("Profile updated successfully!");
      window.location.reload();
    } catch (err) {
      console.error("Profile update error:", err);
      alert("Network / PHP error — check backend.");
    }
  });
});
