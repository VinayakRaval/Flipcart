/**
 * Flipcart - Product Details Page
 */
const API_BASE = "http://localhost/flipcart/backend";
const PRODUCT_API = `${API_BASE}/products/get_product_details.php`;
const CART_API = `${API_BASE}/cart/add_to_cart.php`;

// Get product ID from query string
const urlParams = new URLSearchParams(window.location.search);
const productId = parseInt(urlParams.get("id") || "0", 10);

document.addEventListener("DOMContentLoaded", () => {
  if (productId) loadProductDetails(productId);
  else document.getElementById("productDetail").innerHTML = "<p>Invalid product ID.</p>";
});

// 🧩 Load product details
async function loadProductDetails(id) {
  const container = document.getElementById("productDetail");
  container.innerHTML = "<p>Loading...</p>";

  try {
    const res = await fetch(`${PRODUCT_API}?id=${id}`);
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.error || "Failed to load");

    const p = data.product;
    container.innerHTML = `
      <div class="product-detail-box">
        <div class="image">
          <img src="http://localhost/flipcart/backend/uploads/${p.image}" alt="${p.name}">
        </div>
        <div class="info">
          <h2>${p.name}</h2>
          <p class="price">₹${Number(p.price).toFixed(2)}</p>
          <p class="desc">${p.description || ""}</p>
          <button onclick="addToCart(${p.id})" class="add-btn">Add to Cart</button>
          <button onclick="window.location.href='cart.html'" class="buy-btn">Buy Now</button>
        </div>
      </div>
    `;
  } catch (err) {
    console.error(err);
    container.innerHTML = "<p>Error loading product</p>";
  }
}

// 🛒 Add product to cart
async function addToCart(product_id) {
  const customer = JSON.parse(localStorage.getItem("customer") || "null");
  const user_id = customer && customer.id ? customer.id : 999;

  try {
    const res = await fetch(CART_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id, product_id, quantity: 1 }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.error);
    alert(data.message || "Added to cart!");
  } catch (err) {
    console.error(err);
    alert("Network error — unable to add to cart.");
  }
}
