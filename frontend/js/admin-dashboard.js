/**
 * Flipcart Admin Dashboard JS — Fixed Version
 * Loads dashboard stats, recent products, and recent categories
 */

const BASE_API = "http://localhost/flipcart/backend/admin";

document.addEventListener("DOMContentLoaded", () => {
  loadStats();
  loadRecentProducts();
  loadRecentCategories();
});

async function loadStats() {
  try {
    const res = await fetch(`${BASE_API}/get_stats.php`);
    const data = await res.json();

    if (!res.ok || !data.success) throw new Error(data.error || "Failed to load stats");

    document.getElementById("totalUsers").textContent = data.users || 0;
    document.getElementById("totalProducts").textContent = data.products || 0;
    document.getElementById("totalCategories").textContent = data.categories || 0;
    document.getElementById("totalOrders").textContent = data.orders || 0;
  } catch (err) {
    console.error("Stats error:", err);
    document.querySelectorAll(".stat-value").forEach((el) => (el.textContent = "Error"));
  }
}

// ✅ Load recent products
async function loadRecentProducts() {
  try {
    const res = await fetch(`${BASE_API}/get_products.php`);
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.error || "Failed");

    const tbody = document.getElementById("recentProducts");
    const prods = data.products.slice(0, 5);
    if (!prods.length) {
      tbody.innerHTML = "<tr><td colspan='6'>No products found</td></tr>";
      return;
    }

    tbody.innerHTML = prods
      .map(
        (p) => `
      <tr>
        <td>${p.id}</td>
        <td><img src="http://localhost/flipcart/backend/uploads/${p.image}" width="60" height="60" style="border-radius:6px;"></td>
        <td>${p.name}</td>
        <td>${p.category}</td>
        <td>₹${p.price}</td>
        <td>${p.stock ?? 0}</td>
      </tr>`
      )
      .join("");
  } catch (err) {
    console.error("Recent products error:", err);
    document.getElementById("recentProducts").innerHTML =
      "<tr><td colspan='6'>Error loading data</td></tr>";
  }
}

// ✅ Load recent categories (with icons)
async function loadRecentCategories() {
  try {
    const res = await fetch(`${BASE_API}/get_categories.php`);
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.error || "Failed to load categories");

    const tbody = document.getElementById("recentCategories");
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
        <td><img src="${c.icon_url}" width="45" height="45" style="border-radius:8px;"></td>
        <td>${c.name}</td>
        <td>${c.created_at}</td>
      </tr>`
      )
      .join("");
  } catch (err) {
    console.error("Recent categories error:", err);
    document.getElementById("recentCategories").innerHTML =
      "<tr><td colspan='4'>Error loading data</td></tr>";
  }
}
