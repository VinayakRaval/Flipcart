// frontend/js/admin-categories.js
const API_ADMIN = "http://localhost/flipcart/backend/admin";

document.addEventListener("DOMContentLoaded", () => {
  const showAddBtn = document.getElementById("showAddBtn");
  const categoryForm = document.getElementById("categoryForm");
  const cancelBtn = document.getElementById("cancelBtn");
  const tableBody = document.getElementById("categoryTable");

  async function loadCategories() {
    tableBody.innerHTML = "<tr><td colspan='6'>Loading...</td></tr>";
    try {
      const res = await fetch(`${API_ADMIN}/get_categories.php`);
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed");
      const cats = data.categories;
      if (!cats.length) {
        tableBody.innerHTML = "<tr><td colspan='6'>No categories found</td></tr>";
        return;
      }
      tableBody.innerHTML = cats.map(c => `
        <tr>
          <td>${c.id}</td>
          <td>${c.name}</td>
          <td>${c.emoji || ''}</td>
          <td>${c.icon_url ? `<img src="${c.icon_url}" alt="">` : '-'}</td>
          <td>${c.created_at || '-'}</td>
          <td class="actions">
            <button class="btn" onclick="deleteCategory(${c.id})" style="background:#e53935;">Delete</button>
          </td>
        </tr>
      `).join('');
    } catch (e) {
      console.error(e);
      tableBody.innerHTML = "<tr><td colspan='6'>Error loading data</td></tr>";
    }
  }

  async function deleteCategory(id) {
    if (!confirm("Delete this category?")) return;
    try {
      const res = await fetch(`${API_ADMIN}/delete_category.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Delete failed");
      alert(data.message || "Category deleted");
      loadCategories();
    } catch (e) {
      alert("Network error — check XAMPP Apache log or PHP errors");
      console.error(e);
    }
  }

  categoryForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("catName").value.trim();
    const emoji = document.getElementById("catEmoji").value.trim();
    const icon = document.getElementById("catIcon").files[0];
    if (!name) return alert("Category name required");

    const fd = new FormData();
    fd.append("name", name);
    fd.append("emoji", emoji);
    if (icon) fd.append("icon", icon);

    try {
      const res = await fetch(`${API_ADMIN}/add_category.php`, {
        method: "POST",
        body: fd
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Save failed");
      alert(data.message || "Category saved");
      categoryForm.reset();
      categoryForm.style.display = "none";
      loadCategories();
    } catch (e) {
      alert("Network error — check XAMPP Apache log or PHP errors");
      console.error(e);
    }
  });

  showAddBtn.addEventListener("click", () => {
    categoryForm.style.display = categoryForm.style.display === "block" ? "none" : "block";
  });
  cancelBtn.addEventListener("click", () => (categoryForm.style.display = "none"));

  // initial load
  loadCategories();
});

// Make deleteCategory globally accessible
window.deleteCategory = async function (id) {
  if (!confirm("Delete this category?")) return;
  try {
    const res = await fetch(`${API_ADMIN}/delete_category.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.error || "Delete failed");
    alert(data.message || "Category deleted");
    location.reload();
  } catch (e) {
    alert("Network error — check XAMPP Apache log or PHP errors");
    console.error(e);
  }
};
