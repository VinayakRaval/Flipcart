const API_BASE = "/flipcart/backend";

// inject header into every page dynamically
async function loadHeader() {
  try {
    const resp = await fetch("components/header.html");
    const html = await resp.text();
    document.body.insertAdjacentHTML("afterbegin", html);
    await updateUserSession();
  } catch (e) {
    console.error("Header load failed", e);
  }
}

async function updateUserSession() {
  const nav = document.getElementById("navLinks");
  if (!nav) return;

  try {
    const res = await fetch(`${API_BASE}/auth/check_session.php`, { credentials: "same-origin" });
    const data = await res.json();

    if (data.logged_in) {
  const name = data.role === "admin" ? "Admin" : data.user_name || "User";
  nav.innerHTML = `
    <span style="color:white;margin-right:10px;">Hi, ${name}</span>
    ${data.role === "admin" ? '<a href="admin-dashboard.html" style="color:#ffeb3b;">Admin Panel</a>' : ''}
    <a href="profile.html" style="color:white;margin-left:15px;">Profile</a>
    <a href="orders.html" style="color:white;margin-left:15px;">My Orders</a>
    <a href="cart.html" style="color:white;margin-left:15px;">🛒 Cart</a>
    <a href="#" id="logoutBtn" style="color:#ffb3b3;margin-left:15px;">Logout</a>
  `;

      document.getElementById("logoutBtn").addEventListener("click", logoutUser);
    } else {
      nav.innerHTML = `
        <a href="login.html" style="color:white;">Login</a>
        <a href="register.html" style="color:white;margin-left:15px;">Register</a>
      `;
    }
  } catch (e) {
    console.error("Session check failed", e);
  }
}

async function logoutUser(e) {
  e.preventDefault();
  try {
    await fetch(`${API_BASE}/auth/logout.php`, { credentials: "same-origin" });
    alert("Logged out successfully!");
    window.location.href = "index.html";
  } catch (err) {
    alert("Logout failed");
  }
}

document.addEventListener("DOMContentLoaded", loadHeader);
