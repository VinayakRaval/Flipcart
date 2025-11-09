const API_BASE = "/flipcart/backend";

async function loadAllOrders() {
  const container = document.getElementById("ordersContainer");
  container.innerHTML = "<p>Loading all orders...</p>";

  try {
    const res = await fetch(`${API_BASE}/admin/get_all_orders.php`, {
      credentials: "same-origin",
    });
    const data = await res.json();

    if (!res.ok) {
      if (data.error && data.error.toLowerCase().includes("admin")) {
        alert("Admin access required.");
        window.location.href = "../login.html";
        return;
      }
      container.innerHTML = `<p>${data.error || "Error loading orders."}</p>`;
      return;
    }

    const orders = data.orders || [];
    if (!orders.length) {
      container.innerHTML = "<p>No orders found.</p>";
      return;
    }

    container.innerHTML = `
      <table>
        <thead>
          <tr>
            <th>ID</th><th>User</th><th>Email</th><th>Total (₹)</th><th>Status</th><th>Items</th><th>Action</th>
          </tr>
        </thead>
        <tbody>
          ${orders.map(renderOrderRow).join("")}
        </tbody>
      </table>
    `;
  } catch (err) {
    container.innerHTML = "<p>Network error loading orders.</p>";
  }
}

function renderOrderRow(order) {
  const itemsHTML = order.items.map(it => `
    <div class="order-item">
      <img src="${it.image_url || '../assets/images/products/placeholder.png'}">
      <div>${escapeHtml(it.name)}<br>Qty: ${it.quantity} | ₹${Number(it.price).toFixed(2)}</div>
    </div>
  `).join("");

  const statusOptions = ["pending","shipped","delivered","cancelled"].map(s =>
    `<option value="${s}" ${s===order.status?'selected':''}>${s.charAt(0).toUpperCase()+s.slice(1)}</option>`
  ).join("");

  return `
    <tr>
      <td>${order.order_id}</td>
      <td>${escapeHtml(order.user_name)}</td>
      <td>${escapeHtml(order.email)}</td>
      <td>${Number(order.total_amount).toFixed(2)}</td>
      <td>
        <select id="status-${order.order_id}">
          ${statusOptions}
        </select>
      </td>
      <td>${itemsHTML}</td>
      <td><button onclick="updateStatus(${order.order_id})">Update</button></td>
    </tr>
  `;
}

async function updateStatus(orderId) {
  const newStatus = document.getElementById(`status-${orderId}`).value;
  if (!confirm(`Change status to ${newStatus}?`)) return;

  try {
    const res = await fetch(`${API_BASE}/admin/update_order_status.php`, {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order_id: orderId, status: newStatus })
    });
    const data = await res.json();
    if (res.ok) {
      alert(data.message || "Status updated");
      loadAllOrders();
    } else {
      alert(data.error || "Failed");
    }
  } catch (e) {
    alert("Network error");
  }
}

function escapeHtml(s) {
  return String(s||'').replace(/[&<>"']/g, c =>
    ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])
  );
}

document.addEventListener("DOMContentLoaded", loadAllOrders);
