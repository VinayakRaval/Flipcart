/**
 * Flipcart — Checkout Page Script
 */
const API_CART = "http://localhost/flipcart/backend/cart/view_cart.php";
const API_ORDER = "http://localhost/flipcart/backend/orders/place_order.php";

document.addEventListener("DOMContentLoaded", async () => {
  const customer = JSON.parse(localStorage.getItem("customer") || "null");
  if (!customer || !customer.id) {
    alert("Please log in to continue checkout.");
    window.location.href = "login.html";
    return;
  }

  await loadCartSummary(customer.id);

  document.getElementById("checkoutForm").addEventListener("submit", (e) => {
    e.preventDefault();
    placeOrder(customer.id);
  });
});

async function loadCartSummary(user_id) {
  const container = document.getElementById("summaryItems");
  const totalBox = document.getElementById("totalAmount");
  container.innerHTML = "<p>Loading...</p>";

  try {
    const res = await fetch(`${API_CART}?user_id=${user_id}`);
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.error || "Failed");

    const cart = data.cart || [];
    if (!cart.length) {
      container.innerHTML = "<p>Your cart is empty.</p>";
      totalBox.textContent = "₹0.00";
      return;
    }

    container.innerHTML = cart
      .map(
        (item) => `
        <div class="order-item">
          <img src="http://localhost${item.image_url}" alt="${item.name}">
          <div class="info">
            <div>${item.name}</div>
            <div>Qty: ${item.quantity}</div>
          </div>
          <div>₹${item.subtotal}</div>
        </div>`
      )
      .join("");

    totalBox.textContent = `₹${data.total.toFixed(2)}`;
  } catch (err) {
    console.error(err);
    container.innerHTML = "<p>⚠️ Error loading summary.</p>";
  }
}

async function placeOrder(user_id) {
  const fullName = document.getElementById("fullName").value.trim();
  const address = document.getElementById("address").value.trim();
  const city = document.getElementById("city").value.trim();
  const pincode = document.getElementById("pincode").value.trim();
  const phone = document.getElementById("phone").value.trim();

  if (!fullName || !address || !city || !pincode || !phone) {
    alert("Please fill all delivery details!");
    return;
  }

  const shipping_address = `${fullName}, ${address}, ${city}, ${pincode}, Phone: ${phone}`;
  try {
    const res = await fetch(API_ORDER, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id, shipping_address })
    });

    const data = await res.json();
    if (data.success) {
      showSuccess("✅ Order placed successfully!");
      setTimeout(() => window.location.href = "orders.html", 2000);
    } else {
      alert(data.error || "Order failed");
    }
  } catch (err) {
    console.error(err);
    alert("Network error while placing order");
  }
}

// ✅ Small success popup
function showSuccess(msg) {
  const div = document.createElement("div");
  div.textContent = msg;
  div.style.position = "fixed";
  div.style.top = "40%";
  div.style.left = "50%";
  div.style.transform = "translate(-50%, -50%)";
  div.style.padding = "20px 40px";
  div.style.background = "#388e3c";
  div.style.color = "#fff";
  div.style.fontSize = "18px";
  div.style.fontWeight = "600";
  div.style.borderRadius = "8px";
  div.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
  document.body.appendChild(div);
  setTimeout(() => div.remove(), 1500);
}
