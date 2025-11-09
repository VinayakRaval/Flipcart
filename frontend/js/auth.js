const API_BASE = "../backend/auth"; // adjust path if needed

// Register
const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const msg = document.getElementById("registerMsg");

    const res = await fetch(`${API_BASE}/register.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();
    msg.textContent = data.message || data.error;

    if (data.user) {
      localStorage.setItem("user", JSON.stringify(data.user));
      window.location.href = "index.html";
    }
  });
}

// Login
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const msg = document.getElementById("loginMsg");

    const res = await fetch(`${API_BASE}/login.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    msg.textContent = data.message || data.error;

    if (data.user) {
      localStorage.setItem("user", JSON.stringify(data.user));
      window.location.href = "index.html";
    }
  });
}
