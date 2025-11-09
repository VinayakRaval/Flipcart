// frontend/js/profile-menu.js
document.addEventListener("DOMContentLoaded", () => {
  const profileBtn = document.getElementById("profileName");
  const dropdownMenu = document.getElementById("dropdownMenu");
  const logoutBtn = document.getElementById("logoutBtn");

  // Load user from localStorage
  const user = JSON.parse(localStorage.getItem("customer") || "null");

  // ✅ Set display name
  if (user && user.name) {
    profileBtn.textContent = `${user.name.split(" ")[0]} ▼`;
  } else {
    profileBtn.textContent = "Login ▼";
  }

  // ✅ Toggle dropdown (click-based)
  profileBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (!user || !user.name) {
      window.location.href = "login.html";
      return;
    }
    dropdownMenu.style.display =
      dropdownMenu.style.display === "block" ? "none" : "block";
  });

  // ✅ Close dropdown on outside click
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".profile-dropdown")) {
      dropdownMenu.style.display = "none";
    }
  });

  // ✅ Logout button
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("customer");
      alert("You have been logged out.");
      window.location.href = "index.html";
    });
  }
});
