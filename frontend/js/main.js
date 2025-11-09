/**
 * Flipcart Home Page JS (Dynamic Category + Product Grid)
 */

const API_BASE = "http://localhost/flipcart/backend";
const API_PRODUCTS = `${API_BASE}/products/get_products.php`;
const API_CATEGORIES = `${API_BASE}/admin/get_categories.php`;

// On page load
document.addEventListener("DOMContentLoaded", () => {
  loadCategories();
  loadProducts();

  // search
  document.getElementById("searchBtn").addEventListener("click", () => {
    const q = document.getElementById("searchInput").value.trim();
    loadProducts(q);
  });
});

// =============================
// 🟦 Load Categories
// =============================
async function loadCategories() {
  const container = document.getElementById("categoryGrid");
  container.innerHTML = "<p>Loading...</p>";

  try {
    const res = await fetch(API_CATEGORIES);
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.error);

    const categories = data.categories || [];
    if (!categories.length) {
      container.innerHTML = "<p>No categories found.</p>";
      return;
    }

    container.innerHTML = categories
      .map(
        (cat) => `
      <div class="category-card" onclick="filterByCategory('${cat.name}')">
        <img src="http://localhost${cat.icon_url}" alt="${cat.name}" />
        <p>${cat.name}</p>
      </div>`
      )
      .join("");
  } catch (err) {
    console.error(err);
    container.innerHTML = "<p>Error loading categories.</p>";
  }
}

// =============================
// 🟨 Load Products
// =============================
async function loadProducts(search = "") {
  const list = document.getElementById("productList");
  list.innerHTML = "<p>Loading products...</p>";

  try {
    const res = await fetch(API_PRODUCTS);
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.error);

    let products = data.products || [];

    // simple search filter
    if (search) {
      products = products.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (!products.length) {
      list.innerHTML = "<p>No products found.</p>";
      return;
    }

    list.innerHTML = products
      .map(
        (p) => `
      <div class="product-card" onclick="viewProduct(${p.id})">
        <img src="http://localhost/flipcart/backend/uploads/${p.image}" alt="${p.name}" />
        <h3>${p.name}</h3>
        <p>₹${p.price}</p>
        <button onclick="addToCart(event, ${p.id})">Add to Cart</button>
      </div>`
      )
      .join("");
  } catch (err) {
    console.error(err);
    list.innerHTML = "<p>Error loading products.</p>";
  }
}

// =============================
// 🟧 Helper Functions
// =============================
function filterByCategory(catName) {
  loadProducts(catName);
}

function viewProduct(id) {
  window.location.href = `product-details.html?id=${id}`;
}

function addToCart(e, product_id) {
  e.stopPropagation();
  const customer = JSON.parse(localStorage.getItem("customer") || "null");
  const user_id = customer && customer.id ? customer.id : 999;

  fetch(`${API_BASE}/cart/add_to_cart.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id, product_id, quantity: 1 }),
  })
    .then((r) => r.json())
    .then((d) => {
      if (d.success) alert("Added to cart!");
      else alert(d.error || "Error adding to cart");
    })
    .catch(() => alert("Network error"));
}
