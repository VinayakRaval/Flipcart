// frontend/js/profile.js
const API_BASE = "/flipcart/backend";

async function loadProfile() {
  const msgEl = document.getElementById("profileMsg");
  msgEl.textContent = "";
  try {
    const res = await fetch(`${API_BASE}/profile/get_user.php`, { credentials: 'same-origin' });
    const data = await res.json();
    if (!res.ok) {
      msgEl.style.color = 'red';
      msgEl.textContent = data.error || 'Failed to load profile';
      if (data.error && data.error.toLowerCase().includes('login')) {
        setTimeout(()=> window.location.href = 'login.html', 800);
      }
      return;
    }
    const user = data.user;
    document.getElementById("displayName").value = user.name || '';
    document.getElementById("emailField").value = user.email || '';
  } catch (e) {
    msgEl.style.color = 'red';
    msgEl.textContent = 'Network error';
  }
}

async function saveProfile() {
  const msgEl = document.getElementById("profileMsg");
  msgEl.textContent = '';
  const name = document.getElementById("displayName").value.trim();
  const current = document.getElementById("currentPassword").value;
  const neu = document.getElementById("newPassword").value;

  if (!name) {
    msgEl.style.color = 'red';
    msgEl.textContent = 'Name is required';
    return;
  }

  // Prepare payload
  const payload = { name };

  // If user wants to change password, require current+new
  if (current || neu) {
    if (!current) { msgEl.style.color='red'; msgEl.textContent='Enter current password to change it.'; return; }
    if (!neu || neu.length < 6) { msgEl.style.color='red'; msgEl.textContent='New password must be at least 6 characters.'; return; }
    payload.current_password = current;
    payload.new_password = neu;
  }

  try {
    const res = await fetch(`${API_BASE}/profile/update_user.php`, {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (res.ok) {
      msgEl.style.color = 'green';
      msgEl.textContent = data.message || 'Profile updated';
      // clear password fields
      document.getElementById("currentPassword").value = '';
      document.getElementById("newPassword").value = '';
      // update localStorage customer name if present
      try {
        const c = JSON.parse(localStorage.getItem('customer') || 'null');
        if (c) { c.name = name; localStorage.setItem('customer', JSON.stringify(c)); }
      } catch(e){}
      // update profile-menu display name if present
      const profileName = document.getElementById('profileName');
      if (profileName) profileName.textContent = (name.split(' ')[0]||name);
    } else {
      msgEl.style.color = 'red';
      msgEl.textContent = data.error || 'Update failed';
    }
  } catch (e) {
    msgEl.style.color = 'red';
    msgEl.textContent = 'Network error';
  }
}

document.getElementById('saveProfile')?.addEventListener('click', saveProfile);
document.addEventListener('DOMContentLoaded', loadProfile);
