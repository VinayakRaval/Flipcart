/**
 * Flipcart - Forgot Password Logic
 */

const RESET_API = "http://localhost:8080/flipcart/backend/auth/reset_password.php";


document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("forgotForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const newPassword = document.getElementById("newPassword").value.trim();

    if (!email || !newPassword) {
      alert("Please fill in both fields!");
      return;
    }

    try {
      const res = await fetch(RESET_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, new_password: newPassword }),
      });

      const data = await res.json();

      if (data.success) {
        alert("✅ Password reset successful! You can now log in.");
        window.location.href = "login.html";
      } else {
        alert(`⚠️ ${data.error || "Password reset failed"}`);
      }
    } catch (err) {
      console.error("Error:", err);
      alert("⚠️ Network error — please check XAMPP backend.");
    }
  });
});
