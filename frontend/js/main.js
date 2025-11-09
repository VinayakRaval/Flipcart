/**
 * Flipcart Home Script
 * Handles categories, product loading, and cart adding
 */
const API_PRODUCTS = "http://localhost/flipcart/backend/products/get_products.php";
const API_CATEGORIES = "http://localhost/flipcart/backend/admin/get_categories.php";
const API_ADD_CART = "http://localhost/flipcart/backend/cart/add_to_cart.php";

document.addEventListener("DOMContentLoaded", () => {
  displayUser();
  loadCategories();
  loadProducts();

  document.getElementById("logoutBtn").addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("customer");
    alert("You’ve been logged out!");
    window.location.href = "login.html";
  });
});

function displayUser() {
  const user = JSON.parse(localStorage.getItem("customer") || "null");
  const nameSpan = document.getElementById("usernameDisplay");
  if (user && user.name) {
    nameSpan.textContent = user.name.split(" ")[0];
  } else {
    nameSpan.textContent = "Guest";
  }
}

// ✅ Load Categories (Marquee)
async function loadCategories() {
  const track = document.getElementById("categoryTrack");
  track.innerHTML = "<p>Loading...</p>";

  try {
    const res = await fetch(API_CATEGORIES);
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.error || "Failed");
    const cats = data.categories || [];

    track.innerHTML = cats.map(c => `
      <div class="category-item" onclick="filterCategory('${c.name}')">
        <img src="http://localhost${c.icon_url}" alt="${c.name}">
        <div>${c.name}</div>
      </div>`).join('');
  } catch (err) {
    console.error(err);
    track.innerHTML = "<p>Error loading categories.</p>";
  }
}

// ✅ Load Products
async function loadProducts(category = "") {
  const list = document.getElementById("productList");
  const title = document.getElementById("productTitle");
  list.innerHTML = "<p>Loading products...</p>";

  try {
    const res = await fetch(API_PRODUCTS);
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.error || "Failed");
    let products = data.products || [];

    if (category) {
      products = products.filter(p => p.category && p.category.toLowerCase() === category.toLowerCase());
      title.textContent = `${category} Products`;
    } else {
      title.textContent = "Featured Products";
    }

    if (!products.length) {
      list.innerHTML = "<p>No products found.</p>";
      return;
    }

    list.innerHTML = products.map(p => `
      <div class="product-card">
        <img src="http://localhost/flipcart/backend/uploads/${p.image}" alt="${p.name}">
        <h3>${p.name}</h3>
        <p>₹${p.price}</p>
        <button onclick="addToCart(${p.id})">Add to Cart</button>
      </div>`).join('');
  } catch (err) {
    console.error(err);
    list.innerHTML = "<p>Error loading products.</p>";
  }
}

// ✅ Filter Products by Category
function filterCategory(cat) {
  loadProducts(cat);
  window.scrollTo({ top: 400, behavior: "smooth" });
}

// ✅ Add to Cart
async function addToCart(pid) {
  const customer = JSON.parse(localStorage.getItem("customer") || "null");
  const user_id = customer?.id || 999;

  try {
    const res = await fetch(API_ADD_CART, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id, product_id: pid, quantity: 1 }),
    });
    const data = await res.json();
    if (data.success) {
      showToast(`✅ ${data.message || "Added to cart"}`);
    } else {
      showToast(`⚠️ ${data.error || "Unable to add to cart"}`, true);
    }
  } catch (err) {
    console.error("AddToCart Error:", err);
    showToast("⚠️ Network error — check backend!", true);
  }
}

// ✅ Small Toast
function showToast(msg, isError = false) {
  const toast = document.createElement("div");
  toast.textContent = msg;
  toast.style.position = "fixed";
  toast.style.bottom = "20px";
  toast.style.right = "20px";
  toast.style.padding = "10px 18px";
  toast.style.borderRadius = "6px";
  toast.style.fontWeight = "500";
  toast.style.color = "white";
  toast.style.background = isError ? "#d32f2f" : "#388e3c";
  toast.style.zIndex = "9999";
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2500);
}
