// Load admin header dynamically on every admin page
document.addEventListener("DOMContentLoaded", async () => {
  const headerContainer = document.getElementById("adminHeader");
  if (!headerContainer) return;

  try {
    const res = await fetch("components/admin-header.html");
    const html = await res.text();
    headerContainer.innerHTML = html;

    // after header loads, enable dropdown & logout logic
    setupAdminHeader();
  } catch (e) {
    console.error("Error loading admin header:", e);
  }
});

function setupAdminHeader() {
  const admin = JSON.parse(localStorage.getItem("customer") || "null");
  const nameEl = document.getElementById("adminName");
  const logoutBtn = document.getElementById("logoutAdmin");

  if (admin && admin.role === "admin") {
    nameEl.textContent = admin.name.split(" ")[0] + " ▼";
  } else {
    // Not admin → redirect to login
    alert("Unauthorized access — please log in as admin");
    window.location.href = "login.html";
  }

  logoutBtn.addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("customer");
    alert("Logged out successfully!");
    window.location.href = "login.html";
  });
}
