const API_BASE = "/flipcart/backend";

async function loadOrders() {
  const list = document.getElementById("ordersList");
  list.innerHTML = "<p>Loading your orders...</p>";

  try {
    const res = await fetch(`${API_BASE}/orders/get_user_orders.php`, {
      credentials: "same-origin",
    });
    const data = await res.json();

    if (!res.ok) {
      list.innerHTML = `<p>${data.error || "Failed to load orders."}</p>`;
      return;
    }

    const orders = data.orders || [];
    if (!orders.length) {
      list.innerHTML = "<p>You have no orders yet.</p>";
      return;
    }

    list.innerHTML = orders.map(renderOrderCard).join("");
  } catch (err) {
    list.innerHTML = "<p>Network error while loading orders.</p>";
  }
}

function renderOrderCard(o) {
  const itemsHtml = o.items
    .map(
      (it) => `
      <div class="item-row">
        <img src="${it.image_url || "assets/images/products/placeholder.png"}" alt="">
        <div>
          <h4>${escapeHtml(it.name)}</h4>
          <span>₹${Number(it.price).toFixed(2)} × ${it.quantity}</span>
        </div>
      </div>`
    )
    .join("");

  return `
    <div class="order-card">
      <div class="order-header">
        <h3>Order #${o.order_id}</h3>
        <span>${new Date(o.created_at).toLocaleDateString()}</span>
      </div>

      <div class="order-items">${itemsHtml}</div>

      <div class="order-footer">
        <span>Status: <span class="status">${escapeHtml(o.status)}</span></span><br>
        <span>Total: ₹${Number(o.total_amount).toFixed(2)}</span><br>
        ${o.shipping_address ? `<span>Address: ${escapeHtml(o.shipping_address)}</span>` : ""}
      </div>
    </div>`;
}

function escapeHtml(s) {
  return String(s || "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[c]));
}

document.addEventListener("DOMContentLoaded", loadOrders);
