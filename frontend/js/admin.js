// frontend/js/admin.js
const API_BASE = "/flipcart/backend";

async function fetchJSON(url, options={}) {
  const res = await fetch(url, { credentials: 'same-origin', ...options });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error");
  return data;
}

/* ============ DASHBOARD STATS ============ */
async function loadStats() {
  if (!document.getElementById("statsContainer")) return;
  try {
    const [products, orders, users] = await Promise.all([
      fetchJSON(`${API_BASE}/products/get_products.php?limit=1`),
      fetchJSON(`${API_BASE}/cart/view_cart.php`).catch(()=>({items:[]})), // placeholder
      fetchJSON(`${API_BASE}/auth/check_session.php`)
    ]);
    document.getElementById("totalProducts").textContent = (products.products || []).length;
    document.getElementById("totalOrders").textContent = orders.items ? orders.items.length : "—";
    document.getElementById("totalUsers").textContent = users.user_id ? "1+" : "—";
  } catch (err) {
    console.error(err);
  }
}

/* ============ PRODUCT MANAGEMENT ============ */
async function loadProductTable() {
  const tableBody = document.querySelector("#productTable tbody");
  if (!tableBody) return;
  tableBody.innerHTML = "<tr><td colspan='6'>Loading...</td></tr>";
  try {
    const res = await fetchJSON(`${API_BASE}/products/get_products.php?limit=100`);
    const rows = res.products.map(p => `
      <tr>
        <td>${p.id}</td>
        <td><img src="${p.image_url || '../assets/images/products/placeholder.png'}" class="img-thumb"></td>
        <td>${escapeHtml(p.name)}</td>
        <td>₹ ${Number(p.price).toFixed(2)}</td>
        <td>${p.stock}</td>
        <td>
          <button onclick="editProduct(${p.id}, '${escapeHtml(p.name)}', '${escapeHtml(p.description||'')}', ${p.price}, '${escapeHtml(p.category||'')}', ${p.stock})">✏️</button>
          <button onclick="deleteProduct(${p.id})">🗑️</button>
        </td>
      </tr>`).join('');
    tableBody.innerHTML = rows || "<tr><td colspan='6'>No products found.</td></tr>";
  } catch (e) {
    tableBody.innerHTML = "<tr><td colspan='6'>Error loading products.</td></tr>";
    console.error(e);
  }
}

async function addOrEditProduct(formData, isEdit) {
  const endpoint = isEdit ? `${API_BASE}/admin/edit_product.php` : `${API_BASE}/admin/add_product.php`;
  const res = await fetch(endpoint, {
    method: "POST",
    credentials: 'same-origin',
    body: formData
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Operation failed");
  return data;
}

document.getElementById("productForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const fd = new FormData(e.target);
  const id = fd.get("id");
  try {
    const result = await addOrEditProduct(fd, !!id);
    alert(result.message || "Success");
    e.target.reset();
    document.getElementById("formTitle").textContent = "Add New Product";
    document.getElementById("saveBtn").textContent = "Add Product";
    loadProductTable();
  } catch (err) {
    alert(err.message);
  }
});

function editProduct(id, name, desc, price, category, stock) {
  document.getElementById("formTitle").textContent = "Edit Product";
  document.getElementById("saveBtn").textContent = "Update Product";
  document.getElementById("productId").value = id;
  document.getElementById("name").value = name;
  document.getElementById("description").value = desc;
  document.getElementById("price").value = price;
  document.getElementById("category").value = category;
  document.getElementById("stock").value = stock;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function deleteProduct(id) {
  if (!confirm("Delete this product?")) return;
  try {
    const res = await fetch(`${API_BASE}/admin/delete_product.php`, {
      method: "POST",
      credentials: 'same-origin',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    });
    const data = await res.json();
    if (res.ok) {
      alert(data.message || "Deleted");
      loadProductTable();
    } else alert(data.error || "Failed");
  } catch (err) {
    alert("Network error");
  }
}

function escapeHtml(s) {
  return String(s || '').replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
  );
}

document.addEventListener("DOMContentLoaded", () => {
  loadStats();
  loadProductTable();
});
