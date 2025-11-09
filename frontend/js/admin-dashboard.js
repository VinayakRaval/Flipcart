/**
 * Flipcart Admin Dashboard JS (Final)
 * ✅ Shows admin name, profile photo
 * ✅ Loads stats, recent products, recent categories
 */

const API_ADMIN = "http://localhost/flipcart/backend/admin";
const API_STATS = `${API_ADMIN}/get_stats.php`;
const API_PRODUCTS = `${API_ADMIN}/get_products.php`;
const API_CATEGORIES = `${API_ADMIN}/get_categories.php`;

document.addEventListener("DOMContentLoaded", async () => {
  const admin = JSON.parse(localStorage.getItem("customer") || "null");

  // ✅ Display Admin Name & Photo
  if (admin) {
    document.getElementById("adminName").textContent = admin.name || "Admin";
    document.getElementById("adminNameTitle").textContent = admin.name || "Admin";

    const photo = document.getElementById("adminPhoto");
    if (photo && admin.profile_image) {
      photo.src = `http://localhost/flipcart/backend/uploads/profiles/${admin.profile_image}`;
    }
  }

  // ✅ Logout
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("customer");
      alert("Logged out!");
      window.location.href = "login.html";
    });
  }

  // ✅ Load dashboard data
  loadDashboardStats();
  loadRecentProducts();
  loadRecentCategories();
});

// ======================
// 1️⃣ Load Stats
// ======================
async function loadDashboardStats() {
  try {
    const res = await fetch(API_STATS);
    const data = await res.json();
    console.log("Stats API:", data);

    if (!res.ok || !data.success) throw new Error(data.error || "Failed to load stats");

    document.getElementById("totalUsers").textContent = data.users;
    document.getElementById("totalProducts").textContent = data.products;
    document.getElementById("totalCategories").textContent = data.categories;
    document.getElementById("totalOrders").textContent = data.orders;

  } catch (err) {
    console.error("Dashboard stats load error:", err);
    ["totalUsers", "totalProducts", "totalCategories", "totalOrders"].forEach(
      (id) => (document.getElementById(id).textContent = "Error")
    );
    alert("Error loading dashboard stats — check backend log");
  }
}

// ======================
// 2️⃣ Load Recent Products
// ======================
async function loadRecentProducts() {
  const tbody = document.getElementById("recentProducts");
  if (!tbody) return;
  tbody.innerHTML = "<tr><td colspan='6'>Loading...</td></tr>";

  try {
    const res = await fetch(API_PRODUCTS);
    const data = await res.json();

    if (!res.ok || !data.success) throw new Error(data.error || "Failed to load products");

    const products = data.products.slice(0, 5);
    if (!products.length) {
      tbody.innerHTML = "<tr><td colspan='6'>No products found</td></tr>";
      return;
    }

    tbody.innerHTML = products
      .map(
        (p) => `
        <tr>
          <td>${p.id}</td>
          <td><img src="http://localhost/flipcart/backend/uploads/${p.image}" width="50" height="50"></td>
          <td>${p.name}</td>
          <td>${p.category}</td>
          <td>₹${p.price}</td>
          <td>${p.stock}</td>
        </tr>`
      )
      .join("");
  } catch (err) {
    console.error(err);
    tbody.innerHTML = "<tr><td colspan='6'>Error loading data</td></tr>";
  }
}

// ======================
// 3️⃣ Load Recent Categories
// ======================
async function loadRecentCategories() {
  const tbody = document.getElementById("recentCategories");
  if (!tbody) return;
  tbody.innerHTML = "<tr><td colspan='4'>Loading...</td></tr>";

  try {
    const res = await fetch(API_CATEGORIES);
    const data = await res.json();

    if (!res.ok || !data.success) throw new Error(data.error || "Failed to load categories");

    const cats = data.categories.slice(0, 5);
    if (!cats.length) {
      tbody.innerHTML = "<tr><td colspan='4'>No categories found</td></tr>";
      return;
    }

    tbody.innerHTML = cats
      .map(
        (c) => `
        <tr>
          <td>${c.id}</td>
          <td><img src="http://localhost${c.icon_url}" width="40" height="40" style="border-radius:4px;"></td>

          <td>${c.name}</td>
          <td>${c.created_at}</td>
        </tr>`
      )
      .join("");
  } catch (err) {
    console.error(err);
    tbody.innerHTML = "<tr><td colspan='4'>Error loading data</td></tr>";
  }
}
