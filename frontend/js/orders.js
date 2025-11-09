const API_ORDERS = "http://localhost/flipcart/backend/orders/get_user_orders.php";

document.addEventListener("DOMContentLoaded", () => {
  const customer = JSON.parse(localStorage.getItem("customer") || "null");
  if (!customer || !customer.id) {
    alert("Please log in first!");
    window.location.href = "login.html";
    return;
  }

  loadOrders(customer.id);

  document.getElementById("logoutBtn").addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("customer");
    window.location.href = "login.html";
  });
});

async function loadOrders(userId) {
  const list = document.getElementById("ordersList");
  list.innerHTML = "<p>Loading...</p>";
  try {
    const res = await fetch(`${API_ORDERS}?user_id=${userId}`);
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.error || "Failed");

    const orders = data.orders || [];
    if (!orders.length) {
      list.innerHTML = "<p>No orders found.</p>";
      return;
    }

    list.innerHTML = orders.map(o => `
      <div class="order-card">
        <div class="order-header">
          <span>Order #${o.id}</span>
          <span class="order-status">${o.status || "Pending"}</span>
        </div>
        ${(o.items || []).map(i => `
          <div class="order-item">
            <img src="http://localhost/flipcart/backend/uploads/${i.image}" alt="${i.name}">
            <div>
              <div><b>${i.name}</b></div>
              <div>Qty: ${i.quantity}</div>
              <div>₹${i.price}</div>
            </div>
          </div>
        `).join('')}
        <div style="text-align:right;font-weight:600;margin-top:10px;">
          Total: ₹${o.total_amount}
        </div>
      </div>
    `).join('');
  } catch (err) {
    console.error(err);
    list.innerHTML = "<p>Error loading orders. Please try again later.</p>";
  }
}
