const UPDATE_API = "http://localhost/flipcart/backend/profile/update_user.php";
const IMG_BASE = "http://localhost/flipcart/backend/uploads/profiles/";

document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("customer") || "null");
  if (!user || !user.id) {
    alert("Please log in first!");
    window.location.href = "login.html";
    return;
  }

  // Fill form
  document.getElementById("name").value = user.name || "";
  document.getElementById("email").value = user.email || "";
  document.getElementById("mobile").value = user.mobile || "";
  document.getElementById("address").value = user.address || "";
  document.getElementById("profileName").textContent = user.name;
  document.getElementById("profileEmail").textContent = user.email;

  if (user.profile_image) {
    document.getElementById("profileImage").src = IMG_BASE + user.profile_image;
  }

  // Show small profile image in navbar
  const userBox = document.getElementById("userProfileBox");
  userBox.innerHTML = `
    <img src="${user.profile_image ? IMG_BASE + user.profile_image : 'assets/icons/avatar.png'}"
         style="width:35px;height:35px;border-radius:50%;vertical-align:middle;margin-right:8px;">
    <span style="color:white;font-weight:500;">${user.name}</span>
  `;

  // Save update
  document.getElementById("profileForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append("id", user.id);
    fd.append("name", document.getElementById("name").value.trim());
    fd.append("mobile", document.getElementById("mobile").value.trim());
    fd.append("address", document.getElementById("address").value.trim());
    const file = document.getElementById("profilePic").files[0];
    if (file) fd.append("profile_image", file);

    try {
      const res = await fetch(UPDATE_API, { method: "POST", body: fd });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      const updatedUser = { ...user, ...data.user };
      localStorage.setItem("customer", JSON.stringify(updatedUser));
      alert("Profile updated successfully!");
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Error updating profile.");
    }
  });
});
