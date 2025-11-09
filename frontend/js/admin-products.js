// ============================================================
// ✅ FRONTEND / JS / ADMIN-PRODUCTS.JS
// Fully cleaned & fixed version
// ============================================================

const API_ADMIN = "http://localhost/flipcart/backend/admin";
let editProductId = 0;

// 🧩 Escape utility
function escapeHtml(s) {
  return String(s || "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );
}

// ============================================================
// 1️⃣ LOAD CATEGORIES FOR DROPDOWN
// ============================================================
async function loadCategoriesForAdmin() {
  const select = document.getElementById("prodCategory");
  if (!select) return;

  try {
    const res = await fetch(`${API_ADMIN}/get_categories.php`, {
      credentials: "same-origin",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to fetch categories");

    select.innerHTML = data.categories
      .map(
        (c) =>
          `<option value="${escapeHtml(c.name)}">${escapeHtml(c.name)}</option>`
      )
      .join("");
  } catch (err) {
    console.error("Category load failed:", err);
    select.innerHTML = `<option value="">Error loading categories</option>`;
  }
}

// ============================================================
// 2️⃣ LOAD PRODUCTS LIST
// ============================================================
async function loadProductsList() {
  const tbody = document.getElementById("productsList");
  tbody.innerHTML = "<tr><td colspan='7'>Loading...</td></tr>";

  try {
    const res = await fetch(`${API_ADMIN}/get_products.php`, {
      credentials: "same-origin",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed");

    const products = data.products || [];
    if (!products.length) {
      tbody.innerHTML = "<tr><td colspan='7'>No products found</td></tr>";
      return;
    }

    tbody.innerHTML = products
      .map(
        (p) => `
      <tr>
        <td>${p.id}</td>
        <td><img src="/flipcart/backend/uploads/${p.image ||
          "placeholder.png"}" class="thumb"></td>
        <td>${escapeHtml(p.name)}</td>
        <td>${escapeHtml(p.category)}</td>
        <td>₹${Number(p.price).toFixed(2)}</td>
        <td>${p.stock ?? 0}</td>
        <td>
          <button class="small-btn edit-btn" onclick="startEdit(${p.id})">Edit</button>
          <button class="small-btn del-btn" onclick="deleteProduct(${p.id})">Delete</button>
        </td>
      </tr>`
      )
      .join("");
  } catch (e) {
    console.error(e);
    tbody.innerHTML =
      "<tr><td colspan='7'>Error loading products. Check backend.</td></tr>";
  }
}

// ============================================================
// 3️⃣ START EDIT
// ============================================================
async function startEdit(id) {
  editProductId = id;
  document.getElementById("productForm").style.display = "block";
  window.scrollTo({ top: 0, behavior: "smooth" });

  try {
    const res = await fetch(`${API_ADMIN}/get_product.php?id=${id}`, {
      credentials: "same-origin",
    });
    const data = await res.json();
    if (!res.ok) {
      alert(data.error || "Failed to load product");
      return;
    }

    const p = data.product;
    document.getElementById("prodId").value = p.id;
    document.getElementById("prodName").value = p.name;
    document.getElementById("prodCategory").value = p.category;
    document.getElementById("prodPrice").value = p.price;
    document.getElementById("prodStock").value = p.stock ?? 0;
    document.getElementById("prodDesc").value = p.description ?? "";
  } catch (e) {
    alert("Network error while loading product");
  }
}

// ============================================================
// 4️⃣ DELETE PRODUCT
// ============================================================
async function deleteProduct(id) {
  if (!confirm("Delete this product?")) return;

  try {
    const res = await fetch(`${API_ADMIN}/delete_product.php`, {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const d = await res.json();

    if (res.ok) {
      alert(d.message || "Deleted successfully!");
      loadProductsList();
    } else {
      alert(d.error || "Delete failed");
    }
  } catch (e) {
    alert("Network error — check backend path or Apache logs");
  }
}

// ============================================================
// 5️⃣ ADD / UPDATE PRODUCT
// ============================================================
document.addEventListener("DOMContentLoaded", async () => {
  await loadCategoriesForAdmin();
  await loadProductsList();

  const showAddBtn = document.getElementById("showAddProduct");
  const formContainer = document.getElementById("productForm");
  const cancelBtn = document.getElementById("cancelProd");
  const formEl = document.getElementById("productForm");

  // Toggle Add Product form
  if (showAddBtn)
    showAddBtn.addEventListener("click", () => {
      editProductId = 0;
      document.getElementById("prodId").value = "";
      formEl.reset();
      formContainer.style.display =
        formContainer.style.display === "block" ? "none" : "block";
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

  if (cancelBtn)
    cancelBtn.addEventListener("click", () => {
      formContainer.style.display = "none";
    });

  // Handle submit (Add or Update)
  formEl.addEventListener("submit", async (e) => {
    e.preventDefault();

    const fd = new FormData(formEl);
    const id = document.getElementById("prodId").value;
    const endpoint = id
      ? `${API_ADMIN}/update_product.php`
      : `${API_ADMIN}/add_product.php`;

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        credentials: "same-origin",
        body: fd,
      });
      const data = await res.json();

      if (res.ok) {
        alert(data.message || "Product saved!");
        formEl.reset();
        formContainer.style.display = "none";
        loadProductsList();
      } else {
        alert(data.error || "Failed to save product");
      }
    } catch (e) {
      console.error("Network error", e);
      alert("Network error — check PHP logs");
    }
  });
});
